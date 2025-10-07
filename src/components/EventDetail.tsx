import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { EventCard } from './EventCard';
import { SecurityBadge } from './SecurityBadge';
import { 
  ArrowLeft, 
  CalendarDays, 
  User, 
  Users, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Share2,
  Euro,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

import type { Event, Booking, User as UserType } from '../types';

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onBooking: (booking: Omit<Booking, 'id' | 'bookingDate'>) => Promise<Booking | null>;
  currentUser?: UserType | null;
}

export function EventDetail({ event, onBack, onBooking, currentUser }: EventDetailProps) {
  const [bookingForm, setBookingForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    ticketCount: 1
  });
  const [isBooking, setIsBooking] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const totalPrice = event.price * bookingForm.ticketCount;

  const availablePlaces = event.totalPlaces - event.bookedPlaces;
  const isAlmostFull = availablePlaces <= event.totalPlaces * 0.1;
  const isFull = availablePlaces <= 0;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!bookingForm.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }
    
    if (!bookingForm.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }
    
    if (bookingForm.ticketCount < 1) {
      newErrors.ticketCount = 'Minimaal 1 ticket vereist';
    } else if (bookingForm.ticketCount > availablePlaces) {
      newErrors.ticketCount = `Maximaal ${availablePlaces} tickets beschikbaar`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsBooking(true);
    
    try {
      // Call the parent component's booking handler
      const bookingResult = await onBooking({
        eventId: event.id,
        customerName: bookingForm.name,
        customerEmail: bookingForm.email,
        ticketCount: bookingForm.ticketCount,
        totalPrice: totalPrice
      });

      toast.success(
        <div>
          <div className="font-medium">{bookingForm.ticketCount} ticket(s) succesvol geboekt!</div>
          <div className="text-sm">Bevestigingsmail verzonden naar {bookingForm.email}</div>
        </div>
      );
      
      // Reset form
      setBookingForm({ name: '', email: '', ticketCount: 1 });
      setErrors({});
    } catch (error) {
      toast.error('Er is een fout opgetreden bij het boeken. Probeer opnieuw.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link gekopieerd naar klembord!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-in fade-in-0 slide-in-from-top-4 duration-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-6 hover:text-blue-200 transition-colors hover:translate-x-[-4px] duration-200"
          >
            <ArrowLeft size={20} />
            Terug naar overzicht
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <h1 className="text-3xl md:text-5xl mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
                  {event.title}
                </h1>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 mb-4"
                >
                  <Share2 size={16} className="mr-2" />
                  Delen
                </Button>
              </div>
              
              <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} />
                  <span className="text-lg">{formatDate(event.startDate)}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <span className="text-lg">
                    {formatTime(event.startDate)}
                    {event.endDate && ` - ${formatTime(event.endDate)}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="text-lg">{event.presenter}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <span className="text-lg">
                    {availablePlaces} van {event.totalPlaces} plaatsen beschikbaar
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <span className="text-lg">Event Center Amsterdam</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-64 lg:h-full object-cover rounded-lg shadow-lg animate-in fade-in-0 scale-in-95 duration-700 delay-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-400">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="text-blue-600" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-6">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4>Datum & Tijd</h4>
                      <p className="text-muted-foreground">
                        {formatDate(event.startDate)}<br />
                        {formatTime(event.startDate)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </p>
                    </div>
                    
                    <div>
                      <h4>Locatie</h4>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin size={16} />
                        Event Center Amsterdam<br />
                        Damrak 1, 1012 LG Amsterdam
                      </p>
                    </div>

                    <div>
                      <h4>Contact</h4>
                      <div className="text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2">
                          <Mail size={16} />
                          <a href="mailto:info@eventmanager.nl" className="hover:text-blue-600">
                            info@eventmanager.nl
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={16} />
                          <a href="tel:+31201234567" className="hover:text-blue-600">
                            +31 20 123 4567
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4>Presentator</h4>
                      <p className="text-muted-foreground">{event.presenter}</p>
                    </div>
                    
                    <div>
                      <h4>Prijs</h4>
                      <div className="flex items-center gap-2">
                        <Euro className="text-green-600" size={20} />
                        <span className="text-2xl font-semibold text-green-600">
                          €{event.price.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">per ticket</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Inclusief BTW en servicekosten
                      </p>
                    </div>

                    <div>
                      <h4>Beschikbaarheid</h4>
                      <div className="flex items-center gap-2">
                        {isFull ? (
                          <Badge variant="destructive">Volgeboekt</Badge>
                        ) : isAlmostFull ? (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle size={14} />
                            Bijna vol
                          </Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                            <CheckCircle size={14} />
                            Beschikbaar
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {availablePlaces} plaatsen over
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4>Wat te verwachten</h4>
                      <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                        <li>Professionele presentatie</li>
                        <li>Interactieve workshops</li>
                        <li>Netwerkmogelijkheden</li>
                        <li>Certificaat van deelname</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-purple-600" />
                  Tickets Boeken
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isFull ? (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg mb-2">Event Volgeboekt</h3>
                    <p className="text-muted-foreground mb-4">
                      Dit event is helaas volgeboekt. Houd onze website in de gaten voor toekomstige events.
                    </p>
                    <Button 
                      onClick={onBack}
                      variant="outline"
                      className="w-full"
                    >
                      Andere Events Bekijken
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Volledige naam *</Label>
                      <Input
                        id="name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Je volledige naam"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="je@email.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Je ontvangt een bevestigingsmail op dit adres
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="tickets">Aantal tickets *</Label>
                      <Input
                        id="tickets"
                        type="number"
                        min="1"
                        max={availablePlaces}
                        value={bookingForm.ticketCount}
                        onChange={(e) => setBookingForm(prev => ({ 
                          ...prev, 
                          ticketCount: parseInt(e.target.value) || 1 
                        }))}
                        className={errors.ticketCount ? 'border-red-500' : ''}
                      />
                      {errors.ticketCount ? (
                        <p className="text-red-500 text-sm mt-1">{errors.ticketCount}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximaal {availablePlaces} tickets beschikbaar
                        </p>
                      )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <CreditCard size={16} />
                        Overzicht bestelling
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            {bookingForm.ticketCount} x ticket(s) à €{event.price.toFixed(2)}
                          </span>
                          <span className="text-blue-900 font-medium">
                            €{(event.price * bookingForm.ticketCount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-blue-600">
                          <span>BTW (21%)</span>
                          <span>Inbegrepen</span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 flex justify-between font-medium text-blue-900">
                          <span>Totaal</span>
                          <span className="text-lg">€{totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {isAlmostFull && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          Laatste kans! Slechts {availablePlaces} tickets over.
                        </AlertDescription>
                      </Alert>
                    )}

                    <SecurityBadge variant="minimal" className="justify-center" />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 h-12"
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        'Bezig met boeken...'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard size={16} />
                          Boek {bookingForm.ticketCount} Ticket(s) - €{totalPrice.toFixed(2)}
                        </span>
                      )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <p>✅ Bevestigingsmail wordt direct verzonden</p>
                      <p>🔒 Veilige betaling via iDEAL of creditcard</p>
                      <p>📞 Gratis annulering tot 48 uur voor het event</p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}