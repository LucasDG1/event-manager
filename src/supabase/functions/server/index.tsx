import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

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

// Health check endpoint
app.get("/make-server-44b6519c/health", (c) => {
  return c.json({ status: "ok" });
});

// Send booking confirmation email
app.post("/make-server-44b6519c/send-booking-email", async (c) => {
  try {
    const body = await c.req.json();
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
      return c.json({ 
        success: false, 
        error: "Missing required fields" 
      }, 400);
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
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #92400e; margin-top: 0;">Belangrijke informatie:</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Zorg dat je deze e-mail bewaart als bewijs van je boeking</li>
                <li>Kom 15 minuten voor aanvang van het event</li>
                <li>Breng een geldig identiteitsbewijs mee</li>
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
    console.log("Content:", emailContent.html);

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
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipientEmail, name: recipientName }]
        }],
        from: { email: 'noreply@eventmanager.nl', name: 'Event Manager' },
        subject: emailContent.subject,
        content: [{ type: 'text/html', value: emailContent.html }]
      })
    });
    */

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

Deno.serve(app.fetch);