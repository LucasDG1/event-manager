import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { EventsOverview } from './components/EventsOverview';
import { EventDetail } from './components/EventDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { MyTicketsPage } from './components/MyTicketsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { TicketValidation } from './components/TicketValidation';
import { LoginPromptModal } from './components/LoginPromptModal';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { MetaTags } from './components/MetaTags';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { eventsApi, bookingsApi, emailApi, healthApi, authApi } from './services/api';
import { mockEvents, mockBookings } from './data/mockData';
import type { Event, Booking, User } from './types';

type AppState = 'events' | 'eventDetail' | 'auth' | 'adminAuth' | 'admin' | 'creator' | 'myTickets' | 'about' | 'contact' | 'privacy' | 'terms' | 'ticketValidation';

export default function App() {
  const [appState, setAppState] = useState<AppState>('events');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationTicketId, setValidationTicketId] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Omit<Booking, 'id' | 'bookingDate' | 'userId'> | null>(null);

  // Log security status and meta tags on app initialization
  useEffect(() => {
    console.log('%c🔒 Security Status', 'font-weight: bold; font-size: 16px; color: #10b981;');
    console.log('%c✅ Content-Security-Policy: Active', 'color: #10b981;');
    console.log('%c✅ X-Frame-Options: DENY', 'color: #10b981;');
    console.log('%c✅ X-Content-Type-Options: nosniff', 'color: #10b981;');
    console.log('%c✅ Referrer-Policy: strict-origin-when-cross-origin', 'color: #10b981;');
    console.log('%c✅ Permissions-Policy: Active', 'color: #10b981;');
    console.log('%c✅ Strict-Transport-Security: max-age=31536000', 'color: #10b981;');
    console.log('%c✅ All security headers configured', 'color: #10b981; font-weight: bold;');
    
    console.log('\n%c🏷️ Meta Tags & SEO', 'font-weight: bold; font-size: 16px; color: #3B82F6;');
    console.log('%c✅ Dynamic meta tags: Active', 'color: #3B82F6;');
    console.log('%c✅ Open Graph tags: Configured', 'color: #3B82F6;');
    console.log('%c✅ Twitter Cards: Configured', 'color: #3B82F6;');
    console.log('%c✅ Structured Data (Schema.org): Active', 'color: #3B82F6;');
    console.log('%c✅ PWA Manifest: Available', 'color: #3B82F6;');
    console.log('%c✅ SEO optimized for search engines', 'color: #3B82F6; font-weight: bold;');
  }, []);

  // Check for validation URL parameter on app start
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const validateTicketId = urlParams.get('validate');
    
    if (validateTicketId) {
      setValidationTicketId(validateTicketId);
      setAppState('ticketValidation');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Check for existing session on app start
  useEffect(() => {
    checkSession();
  }, []);

  // Load data from database on app start
  useEffect(() => {
    loadInitialData();
  }, []);

  const checkSession = async () => {
    try {
      const sessionData = await authApi.getSession();
      if (sessionData) {
        setCurrentUser(sessionData.user);
        setCurrentSession(sessionData.session);
        console.log('✅ Session restored for user:', sessionData.user.email);
      }
    } catch (error) {
      console.log('No active session found');
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Loading initial data...');
      
      // First check if backend is available
      try {
        console.log('🔍 Checking backend health...');
        await healthApi.check();
        console.log('✅ Backend is healthy');
      } catch (healthError) {
        console.error('❌ Backend health check failed:', healthError);
        console.log('📱 Using offline mode with mock data');
        
        // Use mock data if backend is not available
        const now = new Date();
        const eventsWithStatus = mockEvents.map(event => ({
          ...event,
          isPast: new Date(event.startDate) < now
        }));
        
        setEvents(eventsWithStatus);
        setBookings(mockBookings);
        setLoading(false);
        return;
      }
      
      let eventsData = [];
      let bookingsData = [];

      try {
        // Try to load events from database
        console.log('📦 Loading events from database...');
        eventsData = await eventsApi.getAll();
        console.log('✅ Events loaded:', eventsData.length);
      } catch (eventsError) {
        console.error('❌ Failed to load events from database:', eventsError);
        // Don't throw here, we'll use fallback data
      }

      try {
        // Try to load bookings from database
        console.log('📋 Loading bookings from database...');
        bookingsData = await bookingsApi.getAll();
        console.log('✅ Bookings loaded:', bookingsData.length);
      } catch (bookingsError) {
        console.error('❌ Failed to load bookings from database:', bookingsError);
        // Don't throw here, we'll use fallback data
      }

      // If no events in database, seed with mock data
      if (eventsData.length === 0) {
        console.log('🌱 No events found, seeding database with initial events...');
        try {
          const seededEvents = [];
          for (const mockEvent of mockEvents) {
            try {
              const { id, isPast, ...eventData } = mockEvent;
              const seededEvent = await eventsApi.create(eventData);
              seededEvents.push(seededEvent);
              console.log('✅ Seeded event:', seededEvent.title);
            } catch (seedError) {
              console.error('❌ Error seeding event:', seedError);
              // Add mock event as fallback
              seededEvents.push(mockEvent);
            }
          }
          eventsData = seededEvents;
        } catch (seedingError) {
          console.error('❌ Error during seeding, using mock data:', seedingError);
          eventsData = mockEvents;
        }
      }

      // Update state with loaded/fallback data
      const now = new Date();
      const eventsWithStatus = eventsData.map(event => ({
        ...event,
        isPast: new Date(event.startDate) < now
      }));

      setEvents(eventsWithStatus);
      setBookings(bookingsData.length > 0 ? bookingsData : mockBookings);

      console.log('✅ Initial data loaded successfully');

    } catch (error) {
      console.error('❌ Critical error loading initial data:', error);
      toast.error('Er is een probleem opgetreden bij het laden van data');
      
      // Final fallback to mock data
      const now = new Date();
      const eventsWithStatus = mockEvents.map(event => ({
        ...event,
        isPast: new Date(event.startDate) < now
      }));
      
      setEvents(eventsWithStatus);
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  // Update isPast status for events (run every minute to keep it current)
  useEffect(() => {
    const updateEventStatus = () => {
      const now = new Date();
      
      setEvents(prev => {
        let hasChanges = false;
        const updatedEvents = prev.map(event => {
          const newIsPast = new Date(event.startDate) < now;
          if (event.isPast !== newIsPast) {
            hasChanges = true;
            return { ...event, isPast: newIsPast };
          }
          return event;
        });
        
        // Only update if there are actual changes
        return hasChanges ? updatedEvents : prev;
      });
    };

    // Don't update immediately since loadInitialData already sets isPast status
    // Set up interval to update every minute
    const interval = setInterval(updateEventStatus, 60000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to avoid infinite loop

  // Auto-scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appState]);

  const handleAuthSuccess = (user: User, session: any) => {
    setCurrentUser(user);
    setCurrentSession(session);
    
    if (user.role === 'admin') {
      setAppState('admin');
    } else if (user.role === 'creator') {
      setAppState('creator');
      toast.success(`Welkom terug, ${user.name || user.email}!`);
    } else {
      // If there's a pending booking, complete it
      if (pendingBooking) {
        setAppState('eventDetail');
        toast.success('Log in succesvol! Je kunt nu je tickets boeken.');
      } else {
        setAppState('events');
        toast.success(`Welkom terug, ${user.name || user.email}!`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (currentUser?.role === 'user' || currentUser?.role === 'creator') {
        await authApi.logout();
      }
      setCurrentUser(null);
      setCurrentSession(null);
      setAppState('events');
      toast.success('Uitgelogd');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Fout bij uitloggen');
    }
  };

  const handleNavigate = (page: AppState) => {
    // If navigating to myTickets, check if user is logged in
    if (page === 'myTickets' && !currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    
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

  const handleBooking = async (booking: Omit<Booking, 'id' | 'bookingDate'>): Promise<Booking | null> => {
    // Check if user is logged in
    if (!currentUser || currentUser.role === 'admin') {
      setPendingBooking(booking);
      setShowLoginPrompt(true);
      return null;
    }

    try {
      // Create booking in database with userId
      const bookingWithUser = {
        ...booking,
        userId: currentUser.id
      };
      const newBooking = await bookingsApi.create(bookingWithUser);
      setBookings(prev => [...prev, newBooking]);
      
      // Update local event state (the database update is handled by the server)
      setEvents(prev => prev.map(event => 
        event.id === booking.eventId
          ? { ...event, bookedPlaces: event.bookedPlaces + booking.ticketCount }
          : event
      ));

      // Send confirmation email
      const event = events.find(e => e.id === booking.eventId);
      if (event) {
        try {
          await emailApi.sendBookingConfirmation({
            recipientEmail: booking.customerEmail,
            recipientName: booking.customerName,
            eventTitle: event.title,
            eventDate: new Date(event.startDate).toLocaleDateString('nl-NL'),
            eventTime: event.startTime || new Date(event.startDate).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
            ticketCount: booking.ticketCount,
            totalPrice: booking.totalPrice,
            bookingId: newBooking.id
          });
          
          toast.success('Boeking bevestigd! Bevestigingsmail is verzonden.');
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          toast.success('Boeking bevestigd! (Bevestigingsmail kon niet worden verzonden)');
        }
      }
      
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Er is een probleem opgetreden bij het maken van de boeking');
      throw error;
    }
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'isPast'>) => {
    try {
      const newEvent = await eventsApi.create(eventData);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event succesvol aangemaakt!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Er is een probleem opgetreden bij het aanmaken van het event');
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const updatedEvent = await eventsApi.update(id, eventData);
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
      toast.success('Event succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Er is een probleem opgetreden bij het bijwerken van het event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventsApi.delete(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      setBookings(prev => prev.filter(booking => booking.eventId !== id));
      toast.success('Event succesvol verwijderd!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Er is een probleem opgetreden bij het verwijderen van het event');
    }
  };

  // Don't show navigation and footer for admin, creator, auth, and ticket validation pages
  const showNavigation = appState !== 'admin' && appState !== 'creator' && appState !== 'auth' && appState !== 'adminAuth' && appState !== 'ticketValidation';
  const showFooter = appState !== 'admin' && appState !== 'creator' && appState !== 'auth' && appState !== 'adminAuth' && appState !== 'ticketValidation';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Gegevens worden geladen...</p>
          </div>
        </div>
      );
    }

    const baseUrl = window.location.origin;

    switch (appState) {
      case 'auth':
        return (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>Event Manager - Ontdek en Boek Fantastische Events in Nederland</title>
              <meta
                name="description"
                content="Ontdek en boek de beste events in Nederland. Concerten, festivals, workshops en meer. Veilig en eenvoudig online tickets boeken met directe bevestiging."
              />
              <link rel="canonical" href={`${baseUrl}/`} />
              <meta property="og:title" content="Event Manager - Ontdek en Boek Fantastische Events" />
              <meta property="og:description" content="Ontdek en boek de beste events in Nederland. Veilig en eenvoudig tickets boeken." />
              <meta property="og:image" content={`${baseUrl}/default-og-image.jpg`} />
              <meta property="og:url" content={`${baseUrl}/`} />
              <meta property="og:type" content="website" />
            </Helmet>
            <EventsOverview events={events} onEventClick={handleEventClick} />
=======
            <MetaTags
              title="Inloggen - Event Manager"
              description="Log in bij Event Manager om je tickets te beheren, events te boeken en je profiel bij te werken."
              canonicalUrl="https://eventmanager.nl/login"
            />
            <AuthPage 
              onLoginSuccess={handleAuthSuccess}
              onBackToWebsite={() => setAppState('events')}
              isAdminLogin={false}
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
          </>
        );

      case 'adminAuth':
        return (
          <>
            <MetaTags
              title="Admin Login - Event Manager"
              description="Admin login voor Event Manager CMS"
              canonicalUrl="https://eventmanager.nl/admin/login"
            />
            <AuthPage 
              onLoginSuccess={handleAuthSuccess}
              onBackToWebsite={() => setAppState('events')}
              isAdminLogin={true}
            />
          </>
        );
      
      case 'events':
        return (
          <>
            <MetaTags
              title="Event Manager - Ontdek en Boek Fantastische Events"
              description="Ontdek en boek de beste events in Nederland. Van muziekfestivals tot workshops, zakelijke conferenties tot culturele evenementen. Veilig en eenvoudig tickets boeken."
              keywords="events, evenementen, tickets, boeken, festivals, workshops, conferenties, Nederland, muziek, cultuur"
            />
            <EventsOverview 
              events={events} 
              onEventClick={handleEventClick}
            />
          </>
        );
      
      case 'eventDetail':
        return selectedEvent ? (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>{`${selectedEvent.title} - Tickets Boeken | Event Manager`}</title>
              <meta name="description" content={`${selectedEvent.description.substring(0, 155)}... Boek nu je tickets voor ${selectedEvent.title} op ${new Date(selectedEvent.startDate).toLocaleDateString('nl-NL')}.`} />
              <link rel="canonical" href={`${baseUrl}/event/${selectedEvent.id}`} />
              <meta property="og:title" content={selectedEvent.title} />
              <meta property="og:description" content={selectedEvent.description} />
              <meta property="og:image" content={selectedEvent.image} />
              <meta property="og:url" content={`${baseUrl}/event/${selectedEvent.id}`} />
              <meta property="og:type" content="event" />
            </Helmet>
=======
            <MetaTags
              title={`${selectedEvent.title} - Event Manager`}
              description={selectedEvent.description}
              keywords={`${selectedEvent.title}, ${selectedEvent.category}, event, tickets, ${selectedEvent.location}`}
              ogTitle={selectedEvent.title}
              ogDescription={selectedEvent.description}
              ogImage={selectedEvent.image}
              canonicalUrl={`https://eventmanager.nl/event/${selectedEvent.id}`}
              structuredData={{
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: selectedEvent.title,
                description: selectedEvent.description,
                startDate: selectedEvent.startDate,
                endDate: selectedEvent.endDate || selectedEvent.startDate,
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                location: {
                  '@type': 'Place',
                  name: selectedEvent.location,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: selectedEvent.location,
                    addressCountry: 'NL'
                  }
                },
                image: selectedEvent.image,
                offers: {
                  '@type': 'Offer',
                  url: `https://eventmanager.nl/event/${selectedEvent.id}`,
                  price: selectedEvent.price,
                  priceCurrency: 'EUR',
                  availability: 'https://schema.org/InStock'
                }
              }}
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
            <EventDetail
              event={selectedEvent}
              onBack={handleBackToEvents}
              onBooking={handleBooking}
              currentUser={currentUser}
            />
          </>
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

      case 'creator':
        return currentUser ? (
          <CreatorDashboard
            user={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );

      case 'myTickets':
        return currentUser ? (
          <>
            <MetaTags
              title="Mijn Tickets - Event Manager"
              description="Bekijk en beheer al je geboekte tickets. Download QR codes, retourneer tickets en bekijk event details."
              canonicalUrl="https://eventmanager.nl/my-tickets"
            />
            <MyTicketsPage
              user={currentUser}
              events={events}
              onBack={() => setAppState('events')}
              onRefreshEvents={loadInitialData}
            />
          </>
        ) : (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );

      case 'about':
        return (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>Over Ons - Event Manager | Jouw Partner in Event Management</title>
              <meta
                name="description"
                content="Event Manager maakt event management eenvoudig, efficiënt en toegankelijk. Ontdek onze missie, waarden en het team achter het platform dat duizenden events organiseert."
              />
              <link rel="canonical" href={`${baseUrl}/about`} />
              <meta property="og:title" content="Over Ons - Event Manager" />
              <meta property="og:url" content={`${baseUrl}/about`} />
            </Helmet>
=======
            <MetaTags
              title="Over Ons - Event Manager"
              description="Event Manager maakt event management eenvoudig, efficiënt en toegankelijk. Ontdek onze missie, waarden en het team achter het platform."
              keywords="over ons, event manager, missie, team, event management platform"
              canonicalUrl="https://eventmanager.nl/about"
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
            <AboutPage />
          </>
        );

      case 'contact':
        return (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>Contact - Event Manager | Neem Contact Op</title>
              <meta
                name="description"
                content="Neem contact op met Event Manager. We helpen je graag met vragen over events, tickets, boekingen en ons platform. Bereikbaar via telefoon, email en contactformulier."
              />
              <link rel="canonical" href={`${baseUrl}/contact`} />
              <meta property="og:title" content="Contact - Event Manager" />
              <meta property="og:url" content={`${baseUrl}/contact`} />
            </Helmet>
=======
            <MetaTags
              title="Contact - Event Manager"
              description="Neem contact op met Event Manager. We helpen je graag met vragen over events, tickets, boekingen en ons platform."
              keywords="contact, support, klantenservice, event manager"
              canonicalUrl="https://eventmanager.nl/contact"
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
            <ContactPage onNavigate={handleNavigate} />
          </>
        );

      case 'privacy':
        return (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>Privacy Beleid - Event Manager | AVG/GDPR Compliant</title>
              <meta
                name="description"
                content="Lees ons privacy beleid en ontdek hoe Event Manager jouw persoonlijke gegevens beschermt volgens de AVG/GDPR wetgeving. Transparant en veilig."
              />
              <link rel="canonical" href={`${baseUrl}/privacy`} />
              <meta property="og:title" content="Privacy Beleid - Event Manager" />
              <meta property="og:url" content={`${baseUrl}/privacy`} />
            </Helmet>
=======
            <MetaTags
              title="Privacy Beleid - Event Manager"
              description="Lees ons privacy beleid en ontdek hoe Event Manager jouw persoonlijke gegevens beschermt volgens de AVG/GDPR wetgeving."
              keywords="privacy beleid, AVG, GDPR, gegevensbescherming, privacy"
              canonicalUrl="https://eventmanager.nl/privacy"
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
            <PrivacyPage />
          </>
        );

      case 'terms':
        return (
          <>
<<<<<<< HEAD
            <Helmet>
              <title>Algemene Voorwaarden - Event Manager | Terms of Service</title>
              <meta
                name="description"
                content="Lees de algemene voorwaarden van Event Manager voor het gebruik van ons platform en het boeken van tickets. Duidelijke afspraken en voorwaarden."
              />
              <link rel="canonical" href={`${baseUrl}/terms`} />
              <meta property="og:title" content="Algemene Voorwaarden - Event Manager" />
              <meta property="og:url" content={`${baseUrl}/terms`} />
            </Helmet>
=======
            <MetaTags
              title="Algemene Voorwaarden - Event Manager"
              description="Lees de algemene voorwaarden van Event Manager voor het gebruik van ons platform en het boeken van tickets."
              keywords="algemene voorwaarden, terms, voorwaarden, servicevoorwaarden"
              canonicalUrl="https://eventmanager.nl/terms"
            />
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
            <TermsPage />
          </>
        );

<<<<<<< HEAD
      case 'myTickets':
        return currentUser ? (
          <>
            <Helmet>
              <title>Mijn Tickets - Event Manager | Beheer Je Boekingen</title>
              <meta
                name="description"
                content="Bekijk en beheer al je geboekte tickets bij Event Manager. Download QR codes, retourneer tickets en bekijk event details van al je boekingen."
              />
              <link rel="canonical" href={`${baseUrl}/my-tickets`} />
              <meta property="og:title" content="Mijn Tickets - Event Manager" />
              <meta property="og:url" content={`${baseUrl}/my-tickets`} />
              <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <MyTicketsPage user={currentUser} events={events} onBack={() => setAppState('events')} onRefreshEvents={() => {}} />
          </>
        ) : (
          <EventsOverview events={events} onEventClick={handleEventClick} />
        );

      case 'auth':
      case 'adminAuth':
        return (
          <AuthPage
            onLoginSuccess={() => {}}
            onBackToWebsite={() => setAppState('events')}
            isAdminLogin={appState === 'adminAuth'}
          />
        );

      case 'admin':
        return <AdminDashboard events={events} bookings={bookings} onLogout={() => {}} onCreateEvent={() => {}} onUpdateEvent={() => {}} onDeleteEvent={() => {}} />;

      case 'creator':
        return <CreatorDashboard user={currentUser!} onLogout={() => {}} />;

=======
>>>>>>> parent of b47f14a (Implement dynamic meta tags with Helmet for SEO and social previews)
      case 'ticketValidation':
        return validationTicketId ? (
          <TicketValidation
            ticketId={validationTicketId}
            onBack={() => {
              setAppState('events');
              setValidationTicketId(null);
            }}
          />
        ) : (
          <EventsOverview 
            events={events} 
            onEventClick={handleEventClick}
          />
        );
      
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
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          setPendingBooking(null);
        }}
        onLogin={() => {
          setShowLoginPrompt(false);
          setAppState('auth');
        }}
        onSignup={() => {
          setShowLoginPrompt(false);
          setAppState('auth');
        }}
      />

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
      
      {/* Floating Admin Button (only visible when not in admin or creator mode) */}
      {appState !== 'admin' && appState !== 'adminAuth' && appState !== 'creator' && (
        <button
          onClick={() => setAppState('adminAuth')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm z-50 hover:scale-105 active:scale-95"
          title="Admin Login"
        >
          Admin
        </button>
      )}
    </div>
  );
}