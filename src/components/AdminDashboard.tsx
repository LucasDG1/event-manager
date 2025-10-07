import { useState, useEffect } from 'react';
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
  Eye,
  Ticket,
  Euro,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { EventForm } from './EventForm';
import { statisticsApi, usedTicketsApi, adminCreatorApi } from '../services/api';
import type { Event, Booking, Ticket, User } from '../types';

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
  const [statistics, setStatistics] = useState<{
    totalEvents: number;
    totalBookings: number;
    totalTicketsSold: number;
    totalRevenue: number;
    eventStats: Record<string, { ticketsSold: number; ticketsUsed?: number; revenue: number; bookingCount: number }>;
  } | null>(null);
  const [usedTickets, setUsedTickets] = useState<any[]>([]);
  const [creators, setCreators] = useState<User[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);

  // Load statistics and used tickets on component mount and when data changes
  useEffect(() => {
    loadStatistics();
    loadUsedTickets();
    loadCreators();
    loadPendingEvents();
  }, [events, bookings]);

  const loadStatistics = async () => {
    try {
      const stats = await statisticsApi.get();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Fallback to local calculation if API fails
      const totalEvents = events.length;
      const totalTicketsSold = bookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
      const upcomingEvents = events.filter(event => !event.isPast).length;
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      setStatistics({
        totalEvents,
        totalBookings: bookings.length,
        totalTicketsSold,
        totalRevenue,
        eventStats: {}
      });
    }
  };

  const loadUsedTickets = async () => {
    try {
      const tickets = await usedTicketsApi.getAll();
      setUsedTickets(tickets);
    } catch (error) {
      console.error('Error loading used tickets:', error);
      setUsedTickets([]);
    }
  };

  const loadCreators = async () => {
    try {
      const creatorsData = await adminCreatorApi.getAllCreators();
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error loading creators:', error);
      setCreators([]);
    }
  };

  const loadPendingEvents = async () => {
    try {
      const pending = await adminCreatorApi.getPendingEvents();
      setPendingEvents(pending);
    } catch (error) {
      console.error('Error loading pending events:', error);
      setPendingEvents([]);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const approvedEvent = await adminCreatorApi.approveEvent(eventId);
      onUpdateEvent(eventId, approvedEvent);
      await loadPendingEvents();
      toast.success('Event goedgekeurd!');
    } catch (error) {
      console.error('Error approving event:', error);
      toast.error('Kon event niet goedkeuren');
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const reason = prompt('Reden voor afwijzing:');
    if (!reason) return;

    try {
      const rejectedEvent = await adminCreatorApi.rejectEvent(eventId, reason);
      onUpdateEvent(eventId, rejectedEvent);
      await loadPendingEvents();
      toast.success('Event afgewezen');
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast.error('Kon event niet afwijzen');
    }
  };

  const totalEvents = statistics?.totalEvents || events.length;
  const totalTicketsSold = statistics?.totalTicketsSold || bookings.reduce((sum, booking) => sum + booking.ticketCount, 0);
  const upcomingEvents = events.filter(event => !event.isPast).length;
  const totalRevenue = statistics?.totalRevenue || bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.presenter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking => {
    if (!booking) return false;
    
    const event = events.find(e => e.id === booking.eventId);
    const customerName = booking.customerName || '';
    const customerEmail = booking.customerEmail || '';
    const eventTitle = event?.title || '';
    
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <p className="text-sm text-muted-foreground">Verkochte Tickets</p>
                  <p className="text-3xl">{totalTicketsSold}</p>
                  <p className="text-xs text-blue-600">{bookings.length} boekingen</p>
                </div>
                <Ticket className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totale Omzet</p>
                  <p className="text-3xl">€{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-purple-600">Alle verkopen</p>
                </div>
                <Euro className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400 bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">Gebruikte Tickets</p>
                  <p className="text-3xl text-orange-900">{usedTickets.length}</p>
                  <p className="text-xs text-orange-600">
                    {totalTicketsSold > 0 ? Math.round((usedTickets.length / totalTicketsSold) * 100) : 0}% van verkocht
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-600" />
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
            <TabsTrigger value="bookings">Boekingen ({filteredBookings.length})</TabsTrigger>
            <TabsTrigger value="creators">Creators ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="used-tickets">Gebruikt ({usedTickets.length})</TabsTrigger>
            <TabsTrigger value="statistics">Statistieken</TabsTrigger>
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
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
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
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gebruikt:</span><br />
                              <span className="font-medium text-orange-600">
                                {statistics?.eventStats[event.id]?.ticketsUsed || 0} / {event.bookedPlaces}
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
                            <span className="font-medium">{booking.customerName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">E-mail:</span><br />
                            <span className="font-medium break-all">{booking.customerEmail}</span>
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

          {/* Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl">Creator Management</h2>
              <Button 
                onClick={() => {
                  loadCreators();
                  loadPendingEvents();
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                Vernieuw
              </Button>
            </div>
            
            {/* Pending Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Events Ter Goedkeuring ({pendingEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Geen events in afwachting van goedkeuring</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event, index) => {
                      const creator = creators.find(c => c.id === event.creatorId);
                      return (
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
                                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                    In Afwachting
                                  </Badge>
                                </div>
                                
                                <p className="text-muted-foreground mb-3 line-clamp-2">
                                  {event.description}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Creator:</span><br />
                                    <span className="font-medium">{creator?.name || creator?.email || 'Onbekend'}</span>
                                  </div>
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
                                    <span className="text-muted-foreground">Plaatsen:</span><br />
                                    <span className="font-medium">{event.totalPlaces}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Aangemaakt:</span><br />
                                    <span className="font-medium">{formatDate(event.createdAt || event.startDate)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveEvent(event.id)}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Goedkeuren
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectEvent(event.id)}
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Afwijzen
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Creators Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Alle Event Creators ({creators.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {creators.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nog geen event creators geregistreerd</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {creators.map((creator, index) => {
                      const creatorEvents = events.filter(e => e.creatorId === creator.id);
                      const approvedEvents = creatorEvents.filter(e => e.status === 'approved');
                      const pendingEventsCount = creatorEvents.filter(e => e.status === 'pending');
                      const rejectedEventsCount = creatorEvents.filter(e => e.status === 'rejected');
                      
                      return (
                        <Card 
                          key={creator.id}
                          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                                    {creator.name?.[0]?.toUpperCase() || creator.email[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{creator.name || 'Geen naam'}</h4>
                                    <p className="text-sm text-muted-foreground">{creator.email}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-4">
                                  <div>
                                    <span className="text-muted-foreground">Totaal Events:</span><br />
                                    <span className="font-medium">{creatorEvents.length}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Goedgekeurd:</span><br />
                                    <span className="font-medium text-green-600">{approvedEvents.length}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">In Afwachting:</span><br />
                                    <span className="font-medium text-yellow-600">{pendingEventsCount.length}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Afgewezen:</span><br />
                                    <span className="font-medium text-red-600">{rejectedEventsCount.length}</span>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-muted-foreground mt-3">
                                  Lid sinds: {new Date(creator.createdAt || Date.now()).toLocaleDateString('nl-NL')}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Used Tickets Tab */}
          <TabsContent value="used-tickets" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl">Gebruikte Tickets</h2>
              <Button 
                onClick={loadUsedTickets}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                Vernieuw
              </Button>
            </div>
            
            <div className="grid gap-4">
              {usedTickets.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Ticket size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg mb-2">Geen gebruikte tickets</h3>
                    <p className="text-muted-foreground">
                      Er zijn nog geen tickets gescand of gevalideerd.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                usedTickets.map((ticket, index) => {
                  const booking = bookings.find(b => b.id === ticket.bookingId);
                  const event = events.find(e => e.id === booking?.eventId);
                  return (
                    <Card 
                      key={ticket.ticketId}
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
                            <span className="text-muted-foreground text-sm">Ticket ID:</span><br />
                            <span className="font-mono text-sm">{ticket.ticketId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Ticket Nr:</span><br />
                            <span className="font-medium">{ticket.ticketNumber} van {ticket.totalTickets}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Klant:</span><br />
                            <span className="font-medium">{booking?.customerName || 'Onbekend'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Gebruikt op:</span><br />
                            <span className="font-medium">{formatDate(ticket.usedAt || ticket.validatedAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle size={14} className="mr-1" />
                              Gebruikt
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <h2 className="text-2xl">Gedetailleerde Statistieken</h2>
            
            <div className="grid gap-6">
              {/* Total Statistics Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    Totaal Overzicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Ticket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{totalTicketsSold}</p>
                      <p className="text-sm text-blue-600">Verkochte Tickets</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-900">{usedTickets.length}</p>
                      <p className="text-sm text-orange-600">Gebruikte Tickets</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">€{totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">Totale Omzet</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">{totalEvents}</p>
                      <p className="text-sm text-purple-600">Totaal Events</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-indigo-900">{bookings.length}</p>
                      <p className="text-sm text-indigo-600">Totaal Boekingen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Event Prestaties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => {
                      const eventBookings = bookings.filter(b => b.eventId === event.id);
                      const eventTicketsSold = eventBookings.reduce((sum, b) => sum + b.ticketCount, 0);
                      const eventRevenue = eventBookings.reduce((sum, b) => sum + b.totalPrice, 0);
                      const occupancyRate = event.totalPlaces > 0 ? (eventTicketsSold / event.totalPlaces) * 100 : 0;
                      const eventTicketsUsed = statistics?.eventStats[event.id]?.ticketsUsed || 0;
                      
                      return (
                        <div key={event.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.startDate).toLocaleDateString('nl-NL')} - {event.presenter}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                              <div>
                                <p className="text-lg font-semibold text-blue-600">{eventTicketsSold}</p>
                                <p className="text-xs text-muted-foreground">Verkocht</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-orange-600">{eventTicketsUsed}</p>
                                <p className="text-xs text-muted-foreground">Gebruikt</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-green-600">€{eventRevenue}</p>
                                <p className="text-xs text-muted-foreground">Omzet</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-purple-600">{eventBookings.length}</p>
                                <p className="text-xs text-muted-foreground">Boekingen</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-indigo-600">{Math.round(occupancyRate)}%</p>
                                <p className="text-xs text-muted-foreground">Bezetting</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar for occupancy */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {eventTicketsSold} van {event.totalPlaces} tickets verkocht • {eventTicketsUsed} gebruikt
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {events.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Geen events gevonden
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Presterende Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events
                      .map(event => ({
                        ...event,
                        ticketsSold: bookings.filter(b => b.eventId === event.id).reduce((sum, b) => sum + b.ticketCount, 0),
                        revenue: bookings.filter(b => b.eventId === event.id).reduce((sum, b) => sum + b.totalPrice, 0)
                      }))
                      .sort((a, b) => b.ticketsSold - a.ticketsSold)
                      .slice(0, 5)
                      .map((event, index) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                              ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
                            `}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">{event.presenter}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{event.ticketsSold} tickets</p>
                            <p className="text-sm text-muted-foreground">€{event.revenue}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
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