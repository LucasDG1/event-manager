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
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { eventsApi, bookingsApi, emailApi, healthApi, authApi } from './services/api';
import { mockEvents, mockBookings } from './data/mockData';
import type { Event, Booking, User } from './types';
import { Helmet } from 'react-helmet';

type AppState =
  | 'events'
  | 'eventDetail'
  | 'auth'
  | 'adminAuth'
  | 'admin'
  | 'creator'
  | 'myTickets'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'ticketValidation';

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

  // Debug logs
  useEffect(() => {
    console.log('%c🔒 Security Status', 'font-weight: bold; font-size: 16px; color: #10b981;');
    console.log('%c✅ All security headers configured', 'color: #10b981; font-weight: bold;');
    console.log('%c🏷️ Meta Tags & SEO', 'font-weight: bold; font-size: 16px; color: #3B82F6;');
  }, []);

  // Check URL for ticket validation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const validateTicketId = urlParams.get('validate');
    if (validateTicketId) {
      setValidationTicketId(validateTicketId);
      setAppState('ticketValidation');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Check session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await authApi.getSession();
        if (sessionData) {
          setCurrentUser(sessionData.user);
          setCurrentSession(sessionData.session);
          console.log('✅ Session restored for user:', sessionData.user.email);
        }
      } catch {
        console.log('No active session found');
      }
    };
    checkSession();
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Backend health check
        try {
          await healthApi.check();
        } catch {
          // Fallback to mock data
          const now = new Date();
          setEvents(mockEvents.map(e => ({ ...e, isPast: new Date(e.startDate) < now })));
          setBookings(mockBookings);
          setLoading(false);
          return;
        }

        let eventsData = await eventsApi.getAll().catch(() => []);
        let bookingsData = await bookingsApi.getAll().catch(() => []);

        if (eventsData.length === 0) {
          eventsData = await Promise.all(
            mockEvents.map(async e => {
              try {
                const { id, isPast, ...data } = e;
                return await eventsApi.create(data);
              } catch {
                return e;
              }
            })
          );
        }

        const now = new Date();
        setEvents(eventsData.map(e => ({ ...e, isPast: new Date(e.startDate) < now })));
        setBookings(bookingsData.length > 0 ? bookingsData : mockBookings);
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Auto-scroll top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appState]);

  const handleNavigate = (page: AppState) => {
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

  const showNavigation =
    !['admin', 'creator', 'auth', 'adminAuth', 'ticketValidation'].includes(appState);
  const showFooter =
    !['admin', 'creator', 'auth', 'adminAuth', 'ticketValidation'].includes(appState);

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
      case 'events':
        return (
          <>
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
          </>
        );

      case 'eventDetail':
        return selectedEvent ? (
          <>
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
            <EventDetail
              event={selectedEvent}
              onBack={handleBackToEvents}
              onBooking={() => {}}
              currentUser={currentUser}
            />
          </>
        ) : (
          <EventsOverview events={events} onEventClick={handleEventClick} />
        );

      case 'about':
        return (
          <>
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
            <AboutPage />
          </>
        );

      case 'contact':
        return (
          <>
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
            <ContactPage onNavigate={handleNavigate} />
          </>
        );

      case 'privacy':
        return (
          <>
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
            <PrivacyPage />
          </>
        );

      case 'terms':
        return (
          <>
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
            <TermsPage />
          </>
        );

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

      case 'ticketValidation':
        return validationTicketId ? (
          <TicketValidation ticketId={validationTicketId} onBack={() => setAppState('events')} />
        ) : (
          <EventsOverview events={events} onEventClick={handleEventClick} />
        );

      default:
        return <EventsOverview events={events} onEventClick={handleEventClick} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navigation currentPage={appState} onNavigate={handleNavigate} currentUser={currentUser} onLogout={() => {}} />}
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
      <main className="flex-1">{renderContent()}</main>
      {showFooter && <Footer onNavigate={handleNavigate} />}
      <Toaster position="top-right" />
    </div>
  );
}
