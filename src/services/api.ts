import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Event, Booking, User } from '../types';
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-44b6519c`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log(`🌐 Making API call to: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    console.log(`📡 Response status: ${response.status} for ${endpoint}`);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error Response: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Get response text first to debug JSON parsing issues
    const responseText = await response.text();
    console.log(`📄 Raw response for ${endpoint}:`, responseText);

    if (!responseText.trim()) {
      throw new Error('Empty response from server');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`❌ JSON Parse Error for ${endpoint}:`, parseError);
      console.error(`Raw response that failed to parse:`, responseText);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    console.log(`✅ Parsed data for ${endpoint}:`, data);
    return data;
    
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Events API
export const eventsApi = {
  async getAll(): Promise<Event[]> {
    const response = await apiCall('/events');
    return response.events || [];
  },

  async create(eventData: Omit<Event, 'id' | 'isPast'>): Promise<Event> {
    const response = await apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return response.event;
  },

  async update(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return response.event;
  },

  async delete(id: string): Promise<void> {
    await apiCall(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings API
export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    const response = await apiCall('/bookings');
    return response.bookings || [];
  },

  async create(bookingData: Omit<Booking, 'id' | 'bookingDate'>): Promise<Booking> {
    const response = await apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.booking;
  },

  async refund(bookingId: string, ticketId?: string): Promise<{
    success: boolean;
    message: string;
    refundedTickets: number;
  }> {
    const response = await apiCall('/refund-booking', {
      method: 'POST',
      body: JSON.stringify({ bookingId, ticketId }),
    });
    return response;
  },
};

// Email API
export const emailApi = {
  async sendBookingConfirmation(emailData: {
    recipientEmail: string;
    recipientName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    ticketCount: number;
    totalPrice: number;
    bookingId: string;
  }): Promise<void> {
    await apiCall('/send-booking-email', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  },
};

// Statistics API
export const statisticsApi = {
  async get(): Promise<{
    totalEvents: number;
    totalBookings: number;
    totalTicketsSold: number;
    totalRevenue: number;
    eventStats: Record<string, {
      ticketsSold: number;
      revenue: number;
      bookingCount: number;
    }>;
  }> {
    const response = await apiCall('/statistics');
    return response.statistics;
  },
};

// QR Code API
export const qrApi = {
  async generateQRCodes(bookingId: string, ticketCount: number): Promise<{
    success: boolean;
    qrCodes: Array<{
      ticketId: string;
      ticketNumber: number;
      qrCodeDataUrl: string;
      validationUrl: string;
    }>;
  }> {
    const response = await apiCall('/generate-qr', {
      method: 'POST',
      body: JSON.stringify({ bookingId, ticketCount }),
    });
    return response;
  },

  async validateTicket(ticketId: string): Promise<{
    success: boolean;
    ticketInfo?: any;
    error?: string;
  }> {
    const response = await apiCall(`/validate-ticket/${ticketId}`);
    return response;
  },

  async checkTicketStatus(ticketId: string): Promise<{
    success: boolean;
    isUsed: boolean;
    usedAt?: string;
    ticketInfo?: any;
    error?: string;
  }> {
    const response = await apiCall(`/check-ticket-status/${ticketId}`);
    return response;
  },
};

// Used Tickets API
export const usedTicketsApi = {
  async getAll(): Promise<any[]> {
    const response = await apiCall('/used-tickets');
    return response.usedTickets || [];
  },
};

// Health check API
export const healthApi = {
  async check(): Promise<{ status: string }> {
    const response = await apiCall('/health');
    return response;
  },
};

// Auth API
const supabaseUrl = `https://${projectId}.supabase.co`;
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, publicAnonKey);
  }
  return supabaseClient;
}

export const authApi = {
  async signup(email: string, password: string, name?: string, role: 'user' | 'creator' = 'user'): Promise<{ user: User; session: any }> {
    // Call our backend to create the user with email_confirm: true
    const response = await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Signup failed');
    }
    
    // Now sign in the user
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role || role,
        createdAt: data.user.created_at
      },
      session: data.session
    };
  },

  async login(email: string, password: string, expectedRole?: 'user' | 'creator'): Promise<{ user: User; session: any }> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    const userRole = data.user.user_metadata?.role || 'user';
    
    // Check if the role matches the expected role
    if (expectedRole && userRole !== expectedRole) {
      throw new Error(`Dit account is geregistreerd als ${userRole === 'creator' ? 'event creator' : 'gebruiker'}. Selecteer het juiste accounttype.`);
    }
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        role: userRole,
        createdAt: data.user.created_at
      },
      session: data.session
    };
  },

  async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async getSession(): Promise<{ user: User; session: any } | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: data.session.user.user_metadata?.name,
        role: data.session.user.user_metadata?.role || 'user',
        createdAt: data.session.user.created_at
      },
      session: data.session
    };
  },

  async signInWithGoogle(): Promise<{ url: string }> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { url: data.url };
  }
};

// User Bookings API
export const userBookingsApi = {
  async getByUserId(userId: string): Promise<Booking[]> {
    const response = await apiCall(`/user-bookings/${userId}`);
    return response.bookings || [];
  },
};

// User Tickets API  
export const userTicketsApi = {
  async getByUserId(userId: string): Promise<any[]> {
    const response = await apiCall(`/user-tickets/${userId}`);
    return response.tickets || [];
  },
  
  async useTicket(ticketId: string): Promise<{
    success: boolean;
    message: string;
    ticket?: any;
  }> {
    const response = await apiCall('/use-ticket', {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
    });
    return response;
  },
};

// Creator Events API
export const creatorEventsApi = {
  async create(eventData: Omit<Event, 'id' | 'isPast'>, creatorId: string): Promise<Event> {
    const response = await apiCall('/creator-events', {
      method: 'POST',
      body: JSON.stringify({ ...eventData, creatorId }),
    });
    return response.event;
  },
  
  async getByCreatorId(creatorId: string): Promise<Event[]> {
    const response = await apiCall(`/creator-events/${creatorId}`);
    return response.events || [];
  },
  
  async getStatistics(creatorId: string): Promise<{
    totalEvents: number;
    pendingEvents: number;
    approvedEvents: number;
    rejectedEvents: number;
    totalRevenue: number;
    eventStats: Record<string, {
      views: number;
      revenue: number;
      ticketsSold: number;
      ticketsUsed: number;
    }>;
  }> {
    const response = await apiCall(`/creator-statistics/${creatorId}`);
    return response.statistics;
  },
};

// Admin Creator Management API
export const adminCreatorApi = {
  async getAllCreators(): Promise<User[]> {
    const response = await apiCall('/admin/creators');
    return response.creators || [];
  },
  
  async getPendingEvents(): Promise<Event[]> {
    const response = await apiCall('/admin/pending-events');
    return response.events || [];
  },
  
  async approveEvent(eventId: string): Promise<Event> {
    const response = await apiCall(`/admin/approve-event/${eventId}`, {
      method: 'POST',
    });
    return response.event;
  },
  
  async rejectEvent(eventId: string, reason: string): Promise<Event> {
    const response = await apiCall(`/admin/reject-event/${eventId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.event;
  },
};