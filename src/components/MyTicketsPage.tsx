import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Ticket, Calendar, MapPin, User, CheckCircle2, XCircle, Download, RefreshCcw } from 'lucide-react';
import { userBookingsApi, userTicketsApi, qrApi, bookingsApi } from '../services/api';
import type { Booking, Event, User as UserType } from '../types';
import { toast } from 'sonner@2.0.3';

interface MyTicketsPageProps {
  user: UserType;
  events: Event[];
  onBack: () => void;
  onRefreshEvents?: () => void;
}

interface TicketWithQR {
  ticketId: string;
  bookingId: string;
  ticketNumber: number;
  totalTickets: number;
  isUsed: boolean;
  createdAt: string;
  usedAt?: string;
  validationUrl: string;
  qrCodeDataUrl?: string;
}

export function MyTicketsPage({ user, events, onBack, onRefreshEvents }: MyTicketsPageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<TicketWithQR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTickets();
  }, [user.id]);

  const loadUserTickets = async () => {
    try {
      setLoading(true);
      
      console.log('🎫 Loading user tickets for user:', user.id);
      
      // Load user bookings
      const userBookings = await userBookingsApi.getByUserId(user.id);
      setBookings(userBookings);
      
      console.log(`📋 Found ${userBookings.length} bookings for user`);
      
      // Load tickets for each booking and generate QR codes
      const allTickets: TicketWithQR[] = [];
      
      for (const booking of userBookings) {
        try {
          console.log(`🎫 Processing booking ${booking.id} with ${booking.ticketCount} tickets`);
          
          // Generate QR codes for this booking (this won't mark as used, just generates QR)
          const qrResponse = await qrApi.generateQRCodes(booking.id, booking.ticketCount);
          
          if (qrResponse.success && qrResponse.qrCodes) {
            console.log(`✅ Generated ${qrResponse.qrCodes.length} QR codes for booking ${booking.id}`);
            
            // Match QR codes with ticket data
            for (const qrCode of qrResponse.qrCodes) {
              // Check ticket status WITHOUT marking as used
              let isUsed = false;
              let usedAt: string | undefined;
              
              try {
                console.log(`🔍 Checking status for ticket: ${qrCode.ticketId}`);
                const statusCheck = await qrApi.checkTicketStatus(qrCode.ticketId);
                isUsed = statusCheck.isUsed || false;
                usedAt = statusCheck.usedAt;
                
                if (isUsed) {
                  console.log(`❌ Ticket ${qrCode.ticketId} is marked as used, will be filtered out`);
                } else {
                  console.log(`✅ Ticket ${qrCode.ticketId} is available`);
                }
              } catch (e) {
                console.error('Error checking ticket status:', e);
                // Ticket status check failed, assume not used
              }
              
              allTickets.push({
                ticketId: qrCode.ticketId,
                bookingId: booking.id,
                ticketNumber: qrCode.ticketNumber,
                totalTickets: booking.ticketCount,
                isUsed,
                usedAt,
                createdAt: booking.bookingDate,
                validationUrl: qrCode.validationUrl,
                qrCodeDataUrl: qrCode.qrCodeDataUrl
              });
            }
          }
        } catch (err) {
          console.error('Error loading tickets for booking:', booking.id, err);
        }
      }
      
      console.log(`📊 Total tickets loaded: ${allTickets.length}`);
      console.log(`📊 Active tickets (not used): ${allTickets.filter(t => !t.isUsed).length}`);
      console.log(`📊 Used tickets: ${allTickets.filter(t => t.isUsed).length}`);
      
      setTickets(allTickets);
      
    } catch (error) {
      console.error('Error loading user tickets:', error);
      toast.error('Kon tickets niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = (ticket: TicketWithQR) => {
    if (!ticket.qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = ticket.qrCodeDataUrl;
    link.download = `ticket-${ticket.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Ticket QR code gedownload!');
  };

  const handleRefundTicket = async (ticket: TicketWithQR) => {
    if (ticket.isUsed) {
      toast.error('Gebruikte tickets kunnen niet worden geretourneerd');
      return;
    }

    if (!confirm('Weet je zeker dat je dit ticket wilt retourneren?')) {
      return;
    }

    try {
      const response = await bookingsApi.refund(ticket.bookingId, ticket.ticketId);
      
      if (response.success) {
        toast.success('Ticket succesvol geretourneerd! Het ticket is weer beschikbaar voor anderen.');
        // Reload tickets to reflect changes
        await loadUserTickets();
        // Refresh events in parent component to update available places
        if (onRefreshEvents) {
          onRefreshEvents();
        }
      } else {
        toast.error(response.message || 'Fout bij retourneren van ticket');
      }
    } catch (error) {
      console.error('Error refunding ticket:', error);
      toast.error('Er is een probleem opgetreden bij het retourneren');
    }
  };

  const handleUseTicket = async (ticket: TicketWithQR) => {
    if (ticket.isUsed) {
      toast.error('Dit ticket is al gebruikt');
      return;
    }

    // Show warning dialog
    const confirmed = confirm(
      '⚠️ WAARSCHUWING: Als je dit ticket gebruikt, kun je het na 15 minuten niet meer retourneren.\n\nWeet je zeker dat je dit ticket wilt gebruiken?'
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log('🎫 Marking ticket as used:', ticket.ticketId);
      
      const response = await userTicketsApi.useTicket(ticket.ticketId);
      
      console.log('📡 Use ticket response:', response);
      
      if (response.success) {
        toast.success('✅ Ticket succesvol gebruikt! Het ticket is verwijderd uit je overzicht.', {
          duration: 6000,
          description: 'Het event team kan je toegang nu verifiëren.'
        });
        
        console.log('🔄 Reloading tickets to reflect changes...');
        // Reload tickets to reflect changes
        await loadUserTickets();
        console.log('✅ Tickets reloaded successfully');
      } else {
        console.error('❌ Failed to use ticket:', response.message);
        toast.error(response.message || 'Fout bij gebruik van ticket');
      }
    } catch (error) {
      console.error('❌ Error using ticket:', error);
      toast.error('Er is een probleem opgetreden bij het gebruik van het ticket');
    }
  };

  const getEventForBooking = (booking: Booking): Event | undefined => {
    return events.find(e => e.id === booking.eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Tickets laden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter out used tickets from display
  const activeTickets = tickets.filter(t => !t.isUsed);
  const activeBookings = bookings.filter(booking => {
    const bookingTickets = tickets.filter(t => t.bookingId === booking.id);
    const hasActiveTickets = bookingTickets.some(t => !t.isUsed);
    return hasActiveTickets;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Terug naar events
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mijn Tickets
              </h1>
              <p className="text-gray-600">
                Welkom terug, {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Ticket size={24} />
              <span className="hidden md:inline">{activeTickets.length} actieve tickets</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {activeBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket size={40} className="text-gray-400" />
              </div>
              <h3 className="mb-2 text-gray-900">Nog geen tickets</h3>
              <p className="text-gray-600 mb-6">
                Je hebt nog geen tickets geboekt. Bekijk onze events en reserveer je plek!
              </p>
              <Button onClick={onBack} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Bekijk Events
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {activeBookings.map((booking) => {
              const event = getEventForBooking(booking);
              const bookingTickets = tickets.filter(t => t.bookingId === booking.id && !t.isUsed);
              
              if (!event) return null;
              
              return (
                <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{event.title}</CardTitle>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {new Date(event.startDate).toLocaleDateString('nl-NL', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                            {event.startTime && ` om ${event.startTime}`}
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Event Center Amsterdam, Damrak 1
                          </div>
                          <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            {booking.customerName}
                          </div>
                        </div>
                      </div>
                      <Badge variant={event.isPast ? 'secondary' : 'default'}>
                        {event.isPast ? 'Afgelopen' : 'Aankomend'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h4 className="mb-3 text-gray-900">Tickets ({bookingTickets.length})</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookingTickets.map((ticket) => (
                          <div
                            key={ticket.ticketId}
                            className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm text-gray-500">Ticket {ticket.ticketNumber}</p>
                                <Badge 
                                  variant={ticket.isUsed ? 'secondary' : 'default'}
                                  className="mt-1"
                                >
                                  {ticket.isUsed ? (
                                    <><XCircle size={14} className="mr-1" /> Gebruikt</>
                                  ) : (
                                    <><CheckCircle2 size={14} className="mr-1" /> Geldig</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            
                            {ticket.qrCodeDataUrl && (
                              <div className="mb-3">
                                <div className="bg-white p-2 rounded border border-gray-200 inline-block">
                                  <img 
                                    src={ticket.qrCodeDataUrl} 
                                    alt={`QR Code voor ticket ${ticket.ticketNumber}`}
                                    className="w-32 h-32"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {ticket.isUsed && ticket.usedAt && (
                              <p className="text-xs text-gray-500 mb-2">
                                Gebruikt op {new Date(ticket.usedAt).toLocaleString('nl-NL')}
                              </p>
                            )}
                            
                            <div className="space-y-2">
                              {!ticket.isUsed && (
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                  onClick={() => handleUseTicket(ticket)}
                                >
                                  <CheckCircle2 size={14} className="mr-2" />
                                  Gebruik Ticket
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleDownloadTicket(ticket)}
                                disabled={!ticket.qrCodeDataUrl}
                              >
                                <Download size={14} className="mr-2" />
                                Download QR
                              </Button>
                              
                              {!ticket.isUsed && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 hover:border-orange-300"
                                  onClick={() => handleRefundTicket(ticket)}
                                >
                                  <RefreshCcw size={14} className="mr-2" />
                                  Retourneer Ticket
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Boekingsnummer:</span>
                        <span className="text-gray-900">{booking.id}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Geboekt op:</span>
                        <span className="text-gray-900">
                          {new Date(booking.bookingDate).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Totaalprijs:</span>
                        <span className="text-gray-900">€{booking.totalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}