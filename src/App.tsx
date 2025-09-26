import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { EventsOverview } from './components/EventsOverview';
import { EventDetail } from './components/EventDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { mockEvents, mockBookings } from './data/mockData';
import type { Event, Booking, User } from './types';

type AppState = 'events' | 'eventDetail' | 'login' | 'admin' | 'about' | 'contact' | 'privacy' | 'terms';

export default function App() {
  const [appState, setAppState] = useState<AppState>('events');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  // Filter out past events automatically
  useEffect(() => {
    const now = new Date();
    setEvents(prev => prev.map(event => ({
      ...event,
      isPast: new Date(event.startDate) < now
    })));
  }, []);

  // Auto-scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appState]);

  const handleLogin = (email: string, password: string) => {
    if (email === 'admin@event.com' && password === 'admin123') {
      setCurrentUser({ id: '1', email, role: 'admin' });
      setAppState('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('events');
  };

  const handleNavigate = (page: AppState) => {
    setAppState(page);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setAppState('eventDetail');
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setAppState('events');
  };

  const handleBooking = (booking: Omit<Booking, 'id' | 'bookingDate'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    // Update event booking count
    setEvents(prev => prev.map(event => 
      event.id === booking.eventId
        ? { ...event, bookedPlaces: event.bookedPlaces + booking.ticketCount }
        : event
    ));
  };

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'isPast'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      isPast: false
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setBookings(prev => prev.filter(booking => booking.eventId !== id));
  };

  // Don't show navigation and footer for admin and login pages
  const showNavigation = appState !== 'admin' && appState !== 'login';
  const showFooter = appState !== 'admin' && appState !== 'login';

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      
      case 'events':
        return (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );
      
      case 'eventDetail':
        return selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            onBack={handleBackToEvents}
            onBooking={handleBooking}
          />
        ) : (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );
      
      case 'admin':
        return (
          <AdminDashboard
            events={events}
            bookings={bookings}
            onLogout={handleLogout}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );

      case 'about':
        return <AboutPage />;

      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;

      case 'privacy':
        return <PrivacyPage />;

      case 'terms':
        return <TermsPage />;
      
      default:
        return (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      {showNavigation && (
        <Navigation
          currentPage={appState}
          onNavigate={handleNavigate}
          isAdmin={currentUser?.role === 'admin'}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
      
      {/* Floating Admin Button (only visible when not in admin mode) */}
      {appState !== 'admin' && appState !== 'login' && (
        <button
          onClick={() => setAppState('login')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm z-50 hover:scale-105 active:scale-95"
          title="Admin Login"
        >
          Admin
        </button>
      )}
    </div>
  );
}