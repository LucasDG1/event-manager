export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  presenter: string;
  totalPlaces: number;
  bookedPlaces: number;
  price: number; // Price per ticket in euros
  image: string;
  isPast: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  name: string;
  email: string;
  ticketCount: number;
  totalPrice: number; // Total amount paid
  bookingDate: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}