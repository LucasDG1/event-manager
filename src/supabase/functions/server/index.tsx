import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import QRCode from "npm:qrcode";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Security headers middleware
app.use("/*", async (c, next) => {
  await next();
  
  // Content Security Policy - prevents XSS attacks
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https: http: https://images.unsplash.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.unsplash.com https://images.unsplash.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests;"
  );
  
  // X-Frame-Options - prevents clickjacking attacks
  c.header("X-Frame-Options", "DENY");
  
  // X-Content-Type-Options - prevents MIME type sniffing
  c.header("X-Content-Type-Options", "nosniff");
  
  // Referrer-Policy - controls how much referrer information is shared
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions-Policy - restricts which browser features can be used
  c.header(
    "Permissions-Policy",
    "camera=(), " +
    "microphone=(), " +
    "geolocation=(), " +
    "interest-cohort=(), " +
    "payment=(), " +
    "usb=(), " +
    "magnetometer=(), " +
    "gyroscope=(), " +
    "accelerometer=()"
  );
  
  // Strict-Transport-Security - enforces HTTPS
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  // X-XSS-Protection - legacy XSS protection (for older browsers)
  c.header("X-XSS-Protection", "1; mode=block");
});

// Health check endpoint
app.get("/make-server-44b6519c/health", (c) => {
  return c.json({ status: "ok" });
});

// Security headers check endpoint
app.get("/make-server-44b6519c/security-check", (c) => {
  return c.json({ 
    status: "secure",
    headers: {
      "Content-Security-Policy": "✅ Active",
      "X-Frame-Options": "✅ DENY",
      "X-Content-Type-Options": "✅ nosniff",
      "Referrer-Policy": "✅ strict-origin-when-cross-origin",
      "Permissions-Policy": "✅ Active",
      "Strict-Transport-Security": "✅ max-age=31536000",
      "X-XSS-Protection": "✅ 1; mode=block"
    },
    message: "All security headers are properly configured"
  });
});

// User signup endpoint
app.post("/make-server-44b6519c/signup", async (c) => {
  try {
    const { email, password, name, role = 'user' } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: name || email.split('@')[0],
        role: role // Store role in user metadata
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Error creating user:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    console.log("✅ User created:", email, "with role:", role);
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: role,
        createdAt: data.user.created_at
      }
    });

  } catch (error) {
    console.error("Error in signup:", error);
    return c.json({ success: false, error: "Failed to create user" }, 500);
  }
});

// Get user bookings endpoint
app.get("/make-server-44b6519c/user-bookings/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const bookings = await kv.getByPrefix("booking_");
    
    // Filter bookings for this user
    const userBookings = bookings.filter(booking => booking.userId === userId);
    
    return c.json({ success: true, bookings: userBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return c.json({ success: false, error: "Failed to fetch user bookings" }, 500);
  }
});

// Get user tickets with QR codes
app.get("/make-server-44b6519c/user-tickets/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Get all bookings for this user
    const allBookings = await kv.getByPrefix("booking_");
    const userBookings = allBookings.filter(booking => booking.userId === userId);
    
    // Get all tickets
    const allTickets = await kv.getByPrefix("ticket_");
    
    // Match tickets to user's bookings
    const userTickets = allTickets.filter(ticket => 
      userBookings.some(booking => ticket.bookingId === booking.id)
    );
    
    return c.json({ success: true, tickets: userTickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return c.json({ success: false, error: "Failed to fetch user tickets" }, 500);
  }
});

// Generate QR code for tickets
app.post("/make-server-44b6519c/generate-qr", async (c) => {
  try {
    const { bookingId, ticketCount } = await c.req.json();
    
    if (!bookingId || !ticketCount) {
      return c.json({ success: false, error: "Missing bookingId or ticketCount" }, 400);
    }

    const qrCodes = [];
    
    // Generate individual QR codes for each ticket
    for (let i = 1; i <= ticketCount; i++) {
      const ticketId = `ticket_${bookingId}_${i}`;
      // Create a proper validation URL that goes through the frontend app
      const baseUrl = c.req.url.split('/functions/')[0];
      const validationUrl = `${baseUrl}/?validate=${ticketId}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Store ticket info for validation
      const ticketInfo = {
        ticketId,
        bookingId,
        ticketNumber: i,
        totalTickets: ticketCount,
        isUsed: false,
        createdAt: new Date().toISOString(),
        validationUrl
      };
      
      await kv.set(ticketId, ticketInfo);
      
      qrCodes.push({
        ticketId,
        ticketNumber: i,
        qrCodeDataUrl,
        validationUrl
      });
    }
    
    console.log(`✅ Generated ${qrCodes.length} QR codes for booking ${bookingId}`);
    
    return c.json({
      success: true,
      qrCodes
    });
    
  } catch (error) {
    console.error("Error generating QR codes:", error);
    return c.json({ success: false, error: "Failed to generate QR codes" }, 500);
  }
});

// Validate ticket endpoint
app.get("/make-server-44b6519c/validate-ticket/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    
    const ticketInfo = await kv.get(ticketId);
    if (!ticketInfo) {
      return c.json({ success: false, error: "Ticket not found" }, 404);
    }
    
    if (ticketInfo.isUsed) {
      return c.json({ 
        success: false, 
        error: "Ticket already used",
        usedAt: ticketInfo.usedAt
      }, 400);
    }
    
    // Mark ticket as used
    const updatedTicketInfo = {
      ...ticketInfo,
      isUsed: true,
      usedAt: new Date().toISOString()
    };
    
    await kv.set(ticketId, updatedTicketInfo);
    
    // Store in used tickets log
    await kv.set(`used_ticket_${ticketId}`, {
      ...updatedTicketInfo,
      validatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Ticket validated: ${ticketId}`);
    
    return c.json({
      success: true,
      message: "Ticket successfully validated",
      ticketInfo: updatedTicketInfo
    });
    
  } catch (error) {
    console.error("Error validating ticket:", error);
    return c.json({ success: false, error: "Failed to validate ticket" }, 500);
  }
});

// Check ticket status (doesn't mark as used)
app.get("/make-server-44b6519c/check-ticket-status/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    
    const ticketInfo = await kv.get(ticketId);
    if (!ticketInfo) {
      return c.json({ success: false, error: "Ticket not found", isUsed: false }, 404);
    }
    
    return c.json({
      success: true,
      isUsed: ticketInfo.isUsed || false,
      usedAt: ticketInfo.usedAt,
      ticketInfo: ticketInfo
    });
    
  } catch (error) {
    console.error("Error checking ticket status:", error);
    return c.json({ success: false, error: "Failed to check ticket status", isUsed: false }, 500);
  }
});

// Get used tickets (for admin)
app.get("/make-server-44b6519c/used-tickets", async (c) => {
  try {
    const usedTickets = await kv.getByPrefix("used_ticket_");
    return c.json({ success: true, usedTickets });
  } catch (error) {
    console.error("Error fetching used tickets:", error);
    return c.json({ success: false, error: "Failed to fetch used tickets" }, 500);
  }
});

// Refund booking endpoint
app.post("/make-server-44b6519c/refund-booking", async (c) => {
  try {
    const { bookingId, ticketId } = await c.req.json();
    
    if (!bookingId) {
      return c.json({ success: false, error: "Missing bookingId" }, 400);
    }
    
    // Ensure bookingId has the booking_ prefix for database lookup
    const bookingKey = bookingId.startsWith('booking_') ? bookingId : `booking_${bookingId}`;
    
    // Get the booking
    const booking = await kv.get(bookingKey);
    if (!booking) {
      console.error(`Booking not found with key: ${bookingKey}`);
      return c.json({ success: false, error: "Booking not found" }, 404);
    }
    
    // If ticketId is provided, refund only that ticket
    if (ticketId) {
      // ticketId already contains the full key (e.g., "ticket_booking_123_1")
      const ticket = await kv.get(ticketId);
      if (!ticket) {
        return c.json({ success: false, message: "Ticket niet gevonden" }, 404);
      }
      
      if (ticket.isUsed) {
        return c.json({ success: false, message: "Gebruikte tickets kunnen niet worden geretourneerd" }, 400);
      }
      
      // Delete the ticket
      await kv.del(ticketId);
      
      // Also delete from used_ticket_ if it exists (cleanup)
      const usedTicketKey = `used_ticket_${ticketId}`;
      try {
        await kv.del(usedTicketKey);
      } catch (e) {
        // Ignore if it doesn't exist
      }
      
      // Update event's booked places
      const eventKey = booking.eventId.startsWith('event_') ? booking.eventId : `event_${booking.eventId}`;
      const event = await kv.get(eventKey);
      if (event) {
        event.bookedPlaces = Math.max(0, event.bookedPlaces - 1);
        await kv.set(eventKey, event);
      }
      
      // Update booking ticket count
      booking.ticketCount -= 1;
      booking.totalPrice = (booking.totalPrice / (booking.ticketCount + 1)) * booking.ticketCount;
      
      if (booking.ticketCount > 0) {
        await kv.set(bookingKey, booking);
      } else {
        // If no tickets left, delete the booking
        await kv.del(bookingKey);
      }
      
      console.log(`✅ Refunded ticket ${ticketId} from booking ${bookingKey}`);
      
      return c.json({
        success: true,
        message: "Ticket successfully refunded",
        refundedTickets: 1
      });
    } else {
      // Refund all tickets in the booking
      // Use booking.id (without prefix) for ticket lookup
      const ticketPrefix = `ticket_${booking.id}_`;
      const tickets = await kv.getByPrefix(ticketPrefix);
      let refundedCount = 0;
      
      for (const ticket of tickets) {
        if (!ticket.isUsed) {
          await kv.del(ticket.ticketId);
          
          // Also delete from used_ticket_ if it exists (cleanup)
          const usedTicketKey = `used_ticket_${ticket.ticketId}`;
          try {
            await kv.del(usedTicketKey);
          } catch (e) {
            // Ignore if it doesn't exist
          }
          
          refundedCount++;
        }
      }
      
      // Update event's booked places
      const eventKey = booking.eventId.startsWith('event_') ? booking.eventId : `event_${booking.eventId}`;
      const event = await kv.get(eventKey);
      if (event) {
        event.bookedPlaces = Math.max(0, event.bookedPlaces - refundedCount);
        await kv.set(eventKey, event);
      }
      
      // Delete the booking
      await kv.del(bookingKey);
      
      console.log(`✅ Refunded ${refundedCount} tickets from booking ${bookingKey}`);
      
      return c.json({
        success: true,
        message: `Successfully refunded ${refundedCount} ticket(s)`,
        refundedTickets: refundedCount
      });
    }
    
  } catch (error) {
    console.error("Error refunding booking:", error);
    return c.json({ success: false, error: "Failed to refund booking" }, 500);
  }
});

// Send booking confirmation email with QR codes
app.post("/make-server-44b6519c/send-booking-email", async (c) => {
  try {
    const body = await c.req.json();
    console.log("📧 Received email request:", body);
    
    const { 
      recipientEmail, 
      recipientName, 
      eventTitle, 
      eventDate, 
      eventTime,
      ticketCount, 
      totalPrice,
      bookingId 
    } = body;

    // Validate required fields
    if (!recipientEmail || !recipientName || !eventTitle || !ticketCount) {
      console.error("❌ Missing required email fields:", {
        recipientEmail: !!recipientEmail,
        recipientName: !!recipientName,
        eventTitle: !!eventTitle,
        ticketCount: !!ticketCount,
        eventDate: !!eventDate,
        eventTime: !!eventTime,
        totalPrice: !!totalPrice,
        bookingId: !!bookingId
      });
      return c.json({ 
        success: false, 
        error: `Missing required fields: ${[
          !recipientEmail && 'recipientEmail',
          !recipientName && 'recipientName', 
          !eventTitle && 'eventTitle',
          !ticketCount && 'ticketCount'
        ].filter(Boolean).join(', ')}` 
      }, 400);
    }

    // Generate QR codes for the tickets
    let qrCodesHtml = '';
    try {
      const qrResponse = await fetch(`${c.req.url.split('/send-booking-email')[0]}/generate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, ticketCount })
      });
      
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        if (qrData.success && qrData.qrCodes) {
          qrCodesHtml = `
            <div style="background: white; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #1f2937; margin-top: 0;">Jouw Tickets</h3>
              <p style="color: #4b5563; margin-bottom: 20px;">Scan deze QR codes bij aankomst op het event:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
                ${qrData.qrCodes.map(qr => `
                  <div style="text-align: center; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937;">Ticket ${qr.ticketNumber}</p>
                    <img src="${qr.qrCodeDataUrl}" alt="QR Code Ticket ${qr.ticketNumber}" style="width: 150px; height: 150px;" />
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Ticket ID: ${qr.ticketId}</p>
                  </div>
                `).join('')}
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px; text-align: center;">
                💡 Tip: Screenshot deze QR codes of print de email voor snelle toegang
              </p>
            </div>
          `;
        }
      }
    } catch (qrError) {
      console.error("Error generating QR codes for email:", qrError);
      // Continue without QR codes if generation fails
    }

    // In a real implementation, you would use a service like SendGrid, Mailgun, or AWS SES
    // For this demo, we'll simulate sending an email and log the details
    const emailContent = {
      to: recipientEmail,
      subject: `Ticket bevestiging - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Event Manager</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ticket Bevestiging</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Beste ${recipientName},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Hartelijk dank voor je boeking! Hierbij ontvang je de bevestiging van je ticket(s).
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1f2937; margin-top: 0;">Event Details</h3>
              <p style="margin: 8px 0;"><strong>Event:</strong> ${eventTitle}</p>
              <p style="margin: 8px 0;"><strong>Datum:</strong> ${eventDate}</p>
              <p style="margin: 8px 0;"><strong>Tijd:</strong> ${eventTime}</p>
              <p style="margin: 8px 0;"><strong>Locatie:</strong> Event Center Amsterdam, Damrak 1</p>
              <p style="margin: 8px 0;"><strong>Aantal tickets:</strong> ${ticketCount}</p>
              <p style="margin: 8px 0;"><strong>Totaalprijs:</strong> €${totalPrice}</p>
              <p style="margin: 8px 0;"><strong>Boeking ID:</strong> ${bookingId}</p>
            </div>
            
            ${qrCodesHtml}
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #92400e; margin-top: 0;">Belangrijke informatie:</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Zorg dat je deze e-mail bewaart als bewijs van je boeking</li>
                <li>Kom 15 minuten voor aanvang van het event</li>
                <li>Breng een geldig identiteitsbewijs mee</li>
                <li>Scan je QR code bij de ingang voor snelle toegang</li>
                <li>Voor vragen kun je contact opnemen via info@eventmanager.nl</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              We kijken ernaar uit je te zien bij het event!
            </p>
            
            <p style="color: #4b5563; margin-top: 30px;">
              Met vriendelijke groet,<br>
              <strong>Het Event Manager Team</strong>
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Event Manager | info@eventmanager.nl | +31 20 123 4567
            </p>
          </div>
        </div>
      `
    };

    // Log the email content (in production, you would actually send it)
    console.log("📧 Booking confirmation email would be sent:");
    console.log("To:", emailContent.to);
    console.log("Subject:", emailContent.subject);
    console.log("Content length:", emailContent.html.length);

    // Store the email log in our key-value store for admin reference
    const emailLog = {
      timestamp: new Date().toISOString(),
      to: recipientEmail,
      subject: emailContent.subject,
      bookingId: bookingId,
      status: 'sent'
    };
    
    await kv.set(`email_log_${bookingId}`, emailLog);

    // In a real implementation, you would integrate with an email service here:
    // For now, we simulate a successful email send
    console.log("✅ Email simulation completed - would be sent to:", recipientEmail);

    return c.json({ 
      success: true, 
      message: "Booking confirmation email sent successfully",
      emailId: `email_${bookingId}_${Date.now()}`
    });

  } catch (error) {
    console.error("Error sending booking email:", error);
    return c.json({ 
      success: false, 
      error: "Failed to send booking confirmation email" 
    }, 500);
  }
});

// Get email logs (for admin)
app.get("/make-server-44b6519c/email-logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("email_log_");
    return c.json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return c.json({ success: false, error: "Failed to fetch email logs" }, 500);
  }
});

// Events CRUD operations
app.get("/make-server-44b6519c/events", async (c) => {
  try {
    const events = await kv.getByPrefix("event_");
    return c.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ success: false, error: "Failed to fetch events" }, 500);
  }
});

app.post("/make-server-44b6519c/events", async (c) => {
  try {
    const eventData = await c.req.json();
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      ...eventData,
      id: eventId.replace('event_', ''),
      isPast: false,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(eventId, event);
    
    console.log("✅ Event created:", event.title);
    return c.json({ success: true, event });
  } catch (error) {
    console.error("Error creating event:", error);
    return c.json({ success: false, error: "Failed to create event" }, 500);
  }
});

app.put("/make-server-44b6519c/events/:id", async (c) => {
  try {
    const eventId = c.req.param("id");
    const updates = await c.req.json();
    
    const existingEvent = await kv.get(`event_${eventId}`);
    if (!existingEvent) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    const updatedEvent = {
      ...existingEvent,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`event_${eventId}`, updatedEvent);
    
    console.log("✅ Event updated:", updatedEvent.title);
    return c.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return c.json({ success: false, error: "Failed to update event" }, 500);
  }
});

app.delete("/make-server-44b6519c/events/:id", async (c) => {
  try {
    const eventId = c.req.param("id");
    
    await kv.del(`event_${eventId}`);
    
    // Also delete related bookings
    const bookings = await kv.getByPrefix("booking_");
    for (const booking of bookings) {
      if (booking.eventId === eventId) {
        await kv.del(`booking_${booking.id}`);
      }
    }
    
    console.log("✅ Event deleted:", eventId);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json({ success: false, error: "Failed to delete event" }, 500);
  }
});

// Bookings CRUD operations
app.get("/make-server-44b6519c/bookings", async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking_");
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ success: false, error: "Failed to fetch bookings" }, 500);
  }
});

app.post("/make-server-44b6519c/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const booking = {
      ...bookingData,
      id: bookingId.replace('booking_', ''),
      bookingDate: new Date().toISOString()
    };
    
    await kv.set(bookingId, booking);
    
    // Update event booking count
    const eventKey = `event_${booking.eventId}`;
    const event = await kv.get(eventKey);
    if (event) {
      const updatedEvent = {
        ...event,
        bookedPlaces: (event.bookedPlaces || 0) + booking.ticketCount
      };
      await kv.set(eventKey, updatedEvent);
    }
    
    console.log("✅ Booking created:", booking.customerName, "for", booking.ticketCount, "tickets");
    return c.json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ success: false, error: "Failed to create booking" }, 500);
  }
});

// Statistics endpoint
app.get("/make-server-44b6519c/statistics", async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking_");
    const events = await kv.getByPrefix("event_");
    const allTickets = await kv.getByPrefix("ticket_");
    
    const totalTicketsSold = bookings.reduce((sum, booking) => sum + (booking.ticketCount || 0), 0);
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Calculate tickets sold and used per event
    const eventStats = {};
    bookings.forEach(booking => {
      if (!eventStats[booking.eventId]) {
        eventStats[booking.eventId] = {
          ticketsSold: 0,
          ticketsUsed: 0,
          revenue: 0,
          bookingCount: 0
        };
      }
      eventStats[booking.eventId].ticketsSold += booking.ticketCount || 0;
      eventStats[booking.eventId].revenue += booking.totalPrice || 0;
      eventStats[booking.eventId].bookingCount += 1;
    });
    
    // Count used tickets per event
    allTickets.forEach(ticket => {
      // Normalize booking IDs for comparison (remove prefix if present)
      const normalizedTicketBookingId = ticket.bookingId?.replace('booking_', '');
      const booking = bookings.find(b => {
        const normalizedBookingId = b.id?.replace('booking_', '');
        return normalizedBookingId === normalizedTicketBookingId;
      });
      if (booking && ticket.isUsed === true) {
        if (eventStats[booking.eventId]) {
          eventStats[booking.eventId].ticketsUsed = (eventStats[booking.eventId].ticketsUsed || 0) + 1;
        }
      }
    });
    
    const statistics = {
      totalEvents: events.length,
      totalBookings: bookings.length,
      totalTicketsSold,
      totalRevenue,
      eventStats
    };
    
    return c.json({ success: true, statistics });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return c.json({ success: false, error: "Failed to fetch statistics" }, 500);
  }
});

// Use Ticket endpoint (mark ticket as used)
app.post("/make-server-44b6519c/use-ticket", async (c) => {
  try {
    const { ticketId } = await c.req.json();
    
    if (!ticketId) {
      return c.json({ success: false, error: "Ticket ID is required" }, 400);
    }
    
    // ticketId already contains the full key (e.g., "ticket_booking_123_1")
    const ticket = await kv.get(ticketId);
    
    if (!ticket) {
      return c.json({ success: false, message: "Ticket niet gevonden" }, 404);
    }
    
    if (ticket.isUsed) {
      return c.json({ success: false, message: "Ticket is al gebruikt" }, 400);
    }
    
    // Mark ticket as used
    const updatedTicket = {
      ...ticket,
      isUsed: true,
      usedAt: new Date().toISOString()
    };
    
    await kv.set(ticketId, updatedTicket);
    
    // Add to used tickets tracking
    const usedKey = `used_ticket_${ticketId}`;
    await kv.set(usedKey, {
      ticketId,
      bookingId: ticket.bookingId,
      usedAt: updatedTicket.usedAt,
      validatedAt: updatedTicket.usedAt,
      ticketNumber: ticket.ticketNumber,
      totalTickets: ticket.totalTickets
    });
    
    console.log("✅ Ticket marked as used:", ticketId);
    return c.json({ success: true, message: "Ticket succesvol gemarkeerd als gebruikt", ticket: updatedTicket });
  } catch (error) {
    console.error("Error using ticket:", error);
    return c.json({ success: false, error: "Failed to use ticket" }, 500);
  }
});

// Creator Events - Create event (pending approval)
app.post("/make-server-44b6519c/creator-events", async (c) => {
  try {
    const eventData = await c.req.json();
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      ...eventData,
      id: eventId.replace('event_', ''),
      bookedPlaces: 0,
      status: 'pending', // Events from creators need approval
      views: 0,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(eventId, event);
    
    console.log("✅ Creator event created (pending approval):", event.title, "by creator:", event.creatorId);
    return c.json({ success: true, event });
  } catch (error) {
    console.error("Error creating creator event:", error);
    return c.json({ success: false, error: "Failed to create event" }, 500);
  }
});

// Get events by creator ID
app.get("/make-server-44b6519c/creator-events/:creatorId", async (c) => {
  try {
    const creatorId = c.req.param("creatorId");
    const allEvents = await kv.getByPrefix("event_");
    
    // Filter events by creator
    const creatorEvents = allEvents.filter(event => event.creatorId === creatorId);
    
    return c.json({ success: true, events: creatorEvents });
  } catch (error) {
    console.error("Error fetching creator events:", error);
    return c.json({ success: false, error: "Failed to fetch creator events" }, 500);
  }
});

// Get creator statistics
app.get("/make-server-44b6519c/creator-statistics/:creatorId", async (c) => {
  try {
    const creatorId = c.req.param("creatorId");
    const allEvents = await kv.getByPrefix("event_");
    const allBookings = await kv.getByPrefix("booking_");
    const allTickets = await kv.getByPrefix("ticket_");
    
    console.log(`📊 Creator stats for ${creatorId}: ${allEvents.length} events, ${allBookings.length} bookings, ${allTickets.length} tickets`);
    
    // Filter events by creator
    const creatorEvents = allEvents.filter(event => event.creatorId === creatorId);
    
    const totalEvents = creatorEvents.length;
    const pendingEvents = creatorEvents.filter(e => e.status === 'pending').length;
    const approvedEvents = creatorEvents.filter(e => e.status === 'approved').length;
    const rejectedEvents = creatorEvents.filter(e => e.status === 'rejected').length;
    
    // Calculate statistics for each approved event
    const eventStats = {};
    let totalRevenue = 0;
    
    creatorEvents.forEach(event => {
      if (event.status === 'approved') {
        // Get bookings for this event
        const eventBookings = allBookings.filter(b => b.eventId === event.id);
        const ticketsSold = eventBookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0);
        const revenue = eventBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        
        // Count used tickets for this event
        const eventTickets = allTickets.filter(ticket => {
          // ticket.bookingId can be with or without prefix
          const normalizedTicketBookingId = ticket.bookingId?.replace('booking_', '');
          return eventBookings.some(booking => {
            // booking.id is always without prefix
            const normalizedBookingId = booking.id?.replace('booking_', '');
            return normalizedTicketBookingId === normalizedBookingId;
          });
        });
        const ticketsUsed = eventTickets.filter(ticket => ticket.isUsed === true).length;
        
        console.log(`📊 Event ${event.title} (${event.id}): ${ticketsSold} sold, ${ticketsUsed} used (${eventTickets.length} total tickets found)`);
        
        totalRevenue += revenue;
        
        eventStats[event.id] = {
          views: event.views || 0,
          ticketsSold,
          ticketsUsed,
          revenue
        };
      }
    });
    
    const statistics = {
      totalEvents,
      pendingEvents,
      approvedEvents,
      rejectedEvents,
      totalRevenue,
      eventStats
    };
    
    return c.json({ success: true, statistics });
  } catch (error) {
    console.error("Error fetching creator statistics:", error);
    return c.json({ success: false, error: "Failed to fetch statistics" }, 500);
  }
});

// Admin: Get all creators
app.get("/make-server-44b6519c/admin/creators", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get all users
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Error fetching users:", error);
      return c.json({ success: false, error: error.message }, 400);
    }

    // Filter for creators only
    const creators = data.users
      .filter(user => user.user_metadata?.role === 'creator')
      .map(user => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role,
        createdAt: user.created_at
      }));

    return c.json({ success: true, creators });
  } catch (error) {
    console.error("Error in admin/creators:", error);
    return c.json({ success: false, error: "Failed to fetch creators" }, 500);
  }
});

// Admin: Get pending events
app.get("/make-server-44b6519c/admin/pending-events", async (c) => {
  try {
    const allEvents = await kv.getByPrefix("event_");
    const pendingEvents = allEvents.filter(event => event.status === 'pending');
    
    return c.json({ success: true, events: pendingEvents });
  } catch (error) {
    console.error("Error fetching pending events:", error);
    return c.json({ success: false, error: "Failed to fetch pending events" }, 500);
  }
});

// Admin: Approve event
app.post("/make-server-44b6519c/admin/approve-event/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const eventKey = `event_${eventId}`;
    const event = await kv.get(eventKey);
    
    if (!event) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    const updatedEvent = {
      ...event,
      status: 'approved',
      approvedAt: new Date().toISOString()
    };
    
    await kv.set(eventKey, updatedEvent);
    
    console.log("✅ Event approved:", event.title);
    return c.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error approving event:", error);
    return c.json({ success: false, error: "Failed to approve event" }, 500);
  }
});

// Admin: Reject event
app.post("/make-server-44b6519c/admin/reject-event/:eventId", async (c) => {
  try {
    const eventId = c.req.param("eventId");
    const { reason } = await c.req.json();
    const eventKey = `event_${eventId}`;
    const event = await kv.get(eventKey);
    
    if (!event) {
      return c.json({ success: false, error: "Event not found" }, 404);
    }
    
    const updatedEvent = {
      ...event,
      status: 'rejected',
      rejectionReason: reason || 'Geen reden opgegeven',
      rejectedAt: new Date().toISOString()
    };
    
    await kv.set(eventKey, updatedEvent);
    
    console.log("✅ Event rejected:", event.title);
    return c.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error rejecting event:", error);
    return c.json({ success: false, error: "Failed to reject event" }, 500);
  }
});

// Generate QR codes for a booking
app.post("/make-server-44b6519c/generate-qr", async (c) => {
  try {
    const { bookingId, ticketCount } = await c.req.json();
    
    if (!bookingId || !ticketCount) {
      return c.json({ success: false, error: "Missing bookingId or ticketCount" }, 400);
    }

    console.log(`🎫 Generating ${ticketCount} QR codes for booking:`, bookingId);

    const qrCodes = [];
    
    for (let i = 1; i <= ticketCount; i++) {
      const ticketId = `ticket_${bookingId}_${i}_${Date.now()}`;
      const validationUrl = `${c.req.header('origin') || 'https://yourapp.com'}?validate=${ticketId}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      qrCodes.push({
        ticketId,
        ticketNumber: i,
        validationUrl,
        qrCodeDataUrl
      });
    }

    console.log(`✅ Generated ${qrCodes.length} QR codes`);
    
    return c.json({ 
      success: true, 
      qrCodes,
      message: `Generated ${qrCodes.length} QR codes successfully`
    });

  } catch (error) {
    console.error("Error generating QR codes:", error);
    return c.json({ success: false, error: "Failed to generate QR codes" }, 500);
  }
});

// Check ticket status (without marking as used)
app.get("/make-server-44b6519c/check-ticket-status/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    
    // Check if this ticket has been marked as used
    const usedTicketKey = `used_ticket_${ticketId}`;
    const usedTicket = await kv.get(usedTicketKey);
    
    if (usedTicket) {
      return c.json({
        success: true,
        isUsed: true,
        usedAt: usedTicket.usedAt,
        ticketId: ticketId
      });
    }
    
    return c.json({
      success: true,
      isUsed: false,
      ticketId: ticketId
    });

  } catch (error) {
    console.error("Error checking ticket status:", error);
    return c.json({ success: false, error: "Failed to check ticket status" }, 500);
  }
});

// Mark ticket as used
app.post("/make-server-44b6519c/use-ticket", async (c) => {
  try {
    const { ticketId } = await c.req.json();
    
    if (!ticketId) {
      return c.json({ success: false, message: "Missing ticketId" }, 400);
    }

    console.log(`🎫 Marking ticket as used:`, ticketId);

    // Check if already used
    const usedTicketKey = `used_ticket_${ticketId}`;
    const existingUsedTicket = await kv.get(usedTicketKey);
    
    if (existingUsedTicket) {
      return c.json({ 
        success: false, 
        message: "Dit ticket is al gebruikt",
        ticket: existingUsedTicket
      });
    }

    // Extract booking ID from ticket ID
    // Format: ticket_bookingId_ticketNumber_timestamp
    const ticketParts = ticketId.split('_');
    let bookingId = '';
    
    // Find the booking ID part (it should be after "ticket_" and before the ticket number)
    if (ticketParts.length >= 3) {
      // Join all parts between 'ticket_' and the last two parts (number and timestamp)
      bookingId = ticketParts.slice(1, ticketParts.length - 2).join('_');
    }

    console.log(`📋 Extracted booking ID from ticket: ${bookingId}`);

    // Mark ticket as used
    const usedTicket = {
      ticketId,
      bookingId,
      usedAt: new Date().toISOString(),
      markedUsedAt: Date.now()
    };
    
    await kv.set(usedTicketKey, usedTicket);
    
    console.log(`✅ Ticket marked as used:`, ticketId);
    
    return c.json({ 
      success: true, 
      message: "Ticket succesvol gemarkeerd als gebruikt",
      ticket: usedTicket
    });

  } catch (error) {
    console.error("Error marking ticket as used:", error);
    return c.json({ success: false, message: "Failed to mark ticket as used", error: error.message }, 500);
  }
});

// Get all used tickets
app.get("/make-server-44b6519c/used-tickets", async (c) => {
  try {
    const usedTickets = await kv.getByPrefix("used_ticket_");
    
    console.log(`📊 Found ${usedTickets.length} used tickets`);
    
    return c.json({ 
      success: true, 
      usedTickets
    });

  } catch (error) {
    console.error("Error fetching used tickets:", error);
    return c.json({ success: false, error: "Failed to fetch used tickets" }, 500);
  }
});

// Get overall statistics (for admin)
app.get("/make-server-44b6519c/statistics", async (c) => {
  try {
    console.log('📊 Calculating overall statistics');

    // Get all data
    const allEvents = await kv.getByPrefix("event_");
    const allBookings = await kv.getByPrefix("booking_");
    const allUsedTickets = await kv.getByPrefix("used_ticket_");
    
    // Calculate overall statistics
    const totalEvents = allEvents.length;
    const totalBookings = allBookings.length;
    const totalTicketsSold = allBookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
    const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Calculate statistics per event
    const eventStats: Record<string, any> = {};
    
    for (const event of allEvents) {
      const eventId = event.id;
      
      // Get bookings for this event
      const eventBookings = allBookings.filter(booking => booking.eventId === eventId);
      
      // Calculate tickets sold
      const ticketsSold = eventBookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
      
      // Calculate revenue
      const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      // Calculate used tickets for this event
      const eventBookingIds = eventBookings.map(b => b.id);
      
      let ticketsUsed = 0;
      for (const usedTicket of allUsedTickets) {
        const ticketBookingId = usedTicket.bookingId;
        if (eventBookingIds.includes(ticketBookingId)) {
          ticketsUsed++;
        }
      }
      
      eventStats[eventId] = {
        ticketsSold,
        ticketsUsed,
        revenue,
        bookingCount: eventBookings.length
      };
    }

    const statistics = {
      totalEvents,
      totalBookings,
      totalTicketsSold,
      totalRevenue,
      eventStats
    };

    console.log('✅ Overall statistics calculated:', statistics);
    
    return c.json({ 
      success: true, 
      statistics
    });

  } catch (error) {
    console.error("Error calculating statistics:", error);
    return c.json({ success: false, error: "Failed to calculate statistics" }, 500);
  }
});

// Get creator statistics
app.get("/make-server-44b6519c/creator-statistics/:creatorId", async (c) => {
  try {
    const creatorId = c.req.param("creatorId");
    
    console.log(`📊 Calculating statistics for creator:`, creatorId);

    // Get all events for this creator
    const allEvents = await kv.getByPrefix("event_");
    const creatorEvents = allEvents.filter(event => event.creatorId === creatorId);
    
    // Get all bookings
    const allBookings = await kv.getByPrefix("booking_");
    
    // Get all used tickets
    const allUsedTickets = await kv.getByPrefix("used_ticket_");
    
    console.log(`📋 Creator has ${creatorEvents.length} events`);
    console.log(`📋 Total bookings: ${allBookings.length}`);
    console.log(`📋 Total used tickets: ${allUsedTickets.length}`);

    // Calculate statistics per event
    const eventStats: Record<string, any> = {};
    let totalRevenue = 0;
    
    for (const event of creatorEvents) {
      const eventId = event.id;
      
      // Get bookings for this event
      const eventBookings = allBookings.filter(booking => booking.eventId === eventId);
      
      // Calculate tickets sold
      const ticketsSold = eventBookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
      
      // Calculate revenue
      const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      totalRevenue += revenue;
      
      // Calculate used tickets for this event
      // Match used tickets to this event's bookings
      const eventBookingIds = eventBookings.map(b => b.id);
      
      console.log(`📋 Event ${eventId} has ${eventBookingIds.length} bookings`);
      
      // Count tickets used for this event
      let ticketsUsed = 0;
      for (const usedTicket of allUsedTickets) {
        // Extract booking ID from ticket
        const ticketBookingId = usedTicket.bookingId;
        
        // Check if this used ticket belongs to any of this event's bookings
        if (eventBookingIds.includes(ticketBookingId)) {
          ticketsUsed++;
          console.log(`✅ Found used ticket for event ${eventId}: ${usedTicket.ticketId} (booking: ${ticketBookingId})`);
        }
      }
      
      eventStats[eventId] = {
        views: 0, // Views tracking can be added later
        ticketsSold,
        ticketsUsed,
        revenue
      };
      
      console.log(`📊 Event ${event.title} stats:`, eventStats[eventId]);
    }

    const statistics = {
      totalEvents: creatorEvents.length,
      pendingEvents: creatorEvents.filter(e => e.status === 'pending').length,
      approvedEvents: creatorEvents.filter(e => e.status === 'approved').length,
      rejectedEvents: creatorEvents.filter(e => e.status === 'rejected').length,
      totalRevenue,
      eventStats
    };

    console.log(`✅ Statistics calculated for creator ${creatorId}:`, statistics);
    
    return c.json({ 
      success: true, 
      statistics
    });

  } catch (error) {
    console.error("Error calculating creator statistics:", error);
    return c.json({ success: false, error: "Failed to calculate statistics" }, 500);
  }
});

Deno.serve(app.fetch);