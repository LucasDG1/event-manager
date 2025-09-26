import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  LogOut, 
  Plus, 
  Calendar, 
  Users, 
  BarChart3,
  Edit,
  Trash2,
  Settings,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { EventForm } from './EventForm';
import type { Event, Booking } from '../types';

interface AdminDashboardProps {
  events: Event[];
  bookings: Booking[];
  onLogout: () => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'isPast'>) => void;
  onUpdateEvent: (id: string, event: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
}

export function AdminDashboard({ 
  events, 
  bookings, 
  onLogout, 
  onCreateEvent, 
  onUpdateEvent, 
  onDeleteEvent 
}: AdminDashboardProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('events');

  const totalEvents = events.length;
  const totalBookings = bookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
  const upcomingEvents = events.filter(event => !event.isPast).length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.presenter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking => {
    const event = events.find(e => e.id === booking.eventId);
    return booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event?.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'isPast'>) => {
    onCreateEvent(eventData);
    setShowEventForm(false);
    toast.success('Event succesvol aangemaakt!');
  };

  const handleUpdateEvent = (eventData: Omit<Event, 'id' | 'isPast'>) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      toast.success('Event succesvol bijgewerkt!');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Weet je zeker dat je dit event wilt verwijderen?')) {
      onDeleteEvent(id);
      toast.success('Event verwijderd');
    }
  };

  const handleExportData = () => {
    const data = {
      events: filteredEvents,
      bookings: filteredBookings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data geëxporteerd!');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-in fade-in-0 slide-in-from-top-4 duration-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl mb-2">Event Manager CMS</h1>
              <p className="text-blue-100">Welkom terug! Beheer je events en boekingen</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button 
                onClick={onLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut size={16} className="mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totaal Events</p>
                  <p className="text-3xl">{totalEvents}</p>
                  <p className="text-xs text-green-600">{upcomingEvents} aankomend</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totaal Boekingen</p>
                  <p className="text-3xl">{totalBookings}</p>
                  <p className="text-xs text-blue-600">{bookings.length} reserveringen</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Geschatte Omzet</p>
                  <p className="text-3xl">€{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-purple-600">Dit jaar</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bezettingsgraad</p>
                  <p className="text-3xl">
                    {totalEvents > 0 ? Math.round((totalBookings / (events.reduce((sum, e) => sum + e.totalPlaces, 0))) * 100) : 0}%
                  </p>
                  <p className="text-xs text-orange-600">Gemiddeld</p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-500">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Zoek events, boekingen, presentators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
            <TabsTrigger value="bookings">Boekingen ({filteredBookings.length})</TabsTrigger>
            <TabsTrigger value="settings">Instellingen</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl">Event Beheer</h2>
              <Button 
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus size={16} className="mr-2" />
                Nieuw Event
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg mb-2">Geen events gevonden</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? 'Probeer een andere zoekterm' : 'Begin met het aanmaken van je eerste event'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setShowEventForm(true)}>
                        <Plus size={16} className="mr-2" />
                        Nieuw Event
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredEvents.map((event, index) => (
                  <Card 
                    key={event.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="truncate">{event.title}</h3>
                            {event.isPast && (
                              <Badge variant="secondary">Afgelopen</Badge>
                            )}
                            {event.bookedPlaces >= event.totalPlaces && !event.isPast && (
                              <Badge variant="destructive">Volgeboekt</Badge>
                            )}
                            {event.bookedPlaces >= event.totalPlaces * 0.9 && event.bookedPlaces < event.totalPlaces && !event.isPast && (
                              <Badge variant="outline" className="border-orange-500 text-orange-700">Bijna vol</Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Datum:</span><br />
                              <span className="font-medium">{formatDate(event.startDate)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Presentator:</span><br />
                              <span className="font-medium">{event.presenter}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Prijs:</span><br />
                              <span className="font-medium">€{event.price.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Geboekt:</span><br />
                              <span className="font-medium">
                                {event.bookedPlaces} / {event.totalPlaces}
                                <span className="text-xs ml-1">
                                  ({Math.round((event.bookedPlaces / event.totalPlaces) * 100)}%)
                                </span>
                              </span>
                              <div className="text-xs text-green-600 mt-1">
                                €{(event.bookedPlaces * event.price).toFixed(2)} omzet
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`#event-${event.id}`, '_blank')}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl">Boekingen Overzicht</h2>
            
            <div className="grid gap-4">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg mb-2">Geen boekingen gevonden</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Probeer een andere zoekterm' : 'Er zijn nog geen boekingen binnengekomen'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking, index) => {
                  const event = events.find(e => e.id === booking.eventId);
                  return (
                    <Card 
                      key={booking.id}
                      className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <span className="text-muted-foreground text-sm">Event:</span><br />
                            <span className="font-medium">{event?.title || 'Onbekend event'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Naam:</span><br />
                            <span className="font-medium">{booking.name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">E-mail:</span><br />
                            <span className="font-medium break-all">{booking.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Tickets:</span><br />
                            <span className="font-medium">{booking.ticketCount}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Totaal betaald:</span><br />
                            <span className="font-medium text-green-600">€{booking.totalPrice.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Geboekt op:</span><br />
                            <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl">Instellingen</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    Systeem Instellingen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4>Platform Informatie</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Event Manager CMS v1.0</p>
                        <p>© 2025 Event Manager</p>
                        <p>Laatste update: {new Date().toLocaleDateString('nl-NL')}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4>Database Status</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          Verbonden
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {totalEvents} events, {bookings.length} boekingen
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="mb-3">Snelle Acties</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download size={16} className="mr-2" />
                        Data Exporteren
                      </Button>
                      <Button variant="outline" onClick={() => setShowEventForm(true)}>
                        <Plus size={16} className="mr-2" />
                        Nieuw Event
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('');
                          toast.success('Filters gereset');
                        }}
                      >
                        Filters Resetten
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>Voor vragen over het systeem of technische ondersteuning:</p>
                    <div className="space-y-2">
                      <p><strong>E-mail:</strong> support@eventmanager.nl</p>
                      <p><strong>Telefoon:</strong> +31 20 123 4567</p>
                      <p><strong>Website:</strong> www.eventmanager.nl</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Form Modal */}
      {(showEventForm || editingEvent) && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}