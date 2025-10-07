export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string; // Added for email compatibility
  endDate?: string;
  presenter: string;
  totalPlaces: number;
  bookedPlaces: number;
  price: number; // Price per ticket in euros
  image: string;
  isPast: boolean;
  creatorId?: string; // Creator who requested this event
  status?: 'pending' | 'approved' | 'rejected'; // Event approval status
  views?: number; // Number of times event was viewed
  rejectionReason?: string; // Reason if event was rejected
}

export interface Booking {
  id: string;
  eventId: string;
  userId?: string; // Optional for now to support legacy bookings
  customerName: string;
  customerEmail: string;
  ticketCount: number;
  totalPrice: number; // Total amount paid
  bookingDate: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'creator';
  createdAt?: string;
}

export interface Ticket {
  ticketId: string;
  bookingId: string;
  ticketNumber: number;
  totalTickets: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  validationUrl: string;
}

export interface QRCode {
  ticketId: string;
  ticketNumber: number;
  qrCodeDataUrl: string;
  validationUrl: string;
}