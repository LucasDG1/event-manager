import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  LogOut, 
  Plus, 
  TrendingUp, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Euro,
  Calendar,
  Ticket,
  RefreshCw
} from 'lucide-react';
import { EventForm } from './EventForm';
import { creatorEventsApi } from '../services/api';
import type { Event, User } from '../types';
import { toast } from 'sonner@2.0.3';

interface CreatorDashboardProps {
  user: User;
  onLogout: () => void;
}

export function CreatorDashboard({ user, onLogout }: CreatorDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadCreatorData();
  }, [user.id]);

  const loadCreatorData = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const [eventsData, statsData] = await Promise.all([
        creatorEventsApi.getByCreatorId(user.id),
        creatorEventsApi.getStatistics(user.id)
      ]);
      
      setEvents(eventsData);
      setStatistics(statsData);
      setLastUpdate(new Date());
      
      if (!showLoadingState) {
        toast.success('Statistieken bijgewerkt!');
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
      toast.error('Kon gegevens niet laden');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    loadCreatorData(false);
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'isPast'>) => {
    try {
      const newEvent = await creatorEventsApi.create(eventData, user.id);
      setEvents(prev => [...prev, newEvent]);
      setShowEventForm(false);
      toast.success('Event ingediend! Het wordt beoordeeld door een beheerder.');
      loadCreatorData(); // Refresh stats
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Kon event niet aanmaken');
    }
  };

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const rejectedEvents = events.filter(e => e.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (showEventForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => {
              setShowEventForm(false);
              setEditingEvent(null);
            }}
            className="mb-4"
          >
            Terug naar dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Nieuw Event Aanmaken</CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm
                onSubmit={handleCreateEvent}
                onCancel={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Creator Dashboard
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">
                  Welkom terug, {user.name || user.email}
                </p>
                <span className="text-xs text-gray-500">
                  • Bijgewerkt: {lastUpdate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="hover:bg-gray-100"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Ververs
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Banner */}
        {statistics && statistics.eventStats && Object.keys(statistics.eventStats).some(id => {
          const stats = statistics.eventStats[id];
          return stats.ticketsUsed > 0;
        }) && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Live ticket updates!</strong> Wanneer klanten hun tickets gebruiken, verdwijnen deze uit hun "Mijn Tickets" overzicht en worden ze hier geteld als "Gebruikt". Klik op "Ververs" voor de nieuwste statistieken.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Totaal Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{statistics?.totalEvents || 0}</span>
                <Calendar className="text-purple-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Goedgekeurd</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-green-600">{statistics?.approvedEvents || 0}</span>
                <CheckCircle2 className="text-green-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">In afwachting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-orange-600">{statistics?.pendingEvents || 0}</span>
                <Clock className="text-orange-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Totale Omzet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl text-blue-600">€{statistics?.totalRevenue || 0}</span>
                <Euro className="text-blue-500" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Event Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowEventForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            <Plus size={20} className="mr-2" />
            Nieuw Event Aanmaken
          </Button>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Alle Events ({events.length})</TabsTrigger>
            <TabsTrigger value="pending">In afwachting ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="approved">Goedgekeurd ({approvedEvents.length})</TabsTrigger>
            <TabsTrigger value="rejected">Afgewezen ({rejectedEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {events.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Je hebt nog geen events aangemaakt.</p>
                <Button
                  onClick={() => setShowEventForm(true)}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Maak je eerste event
                </Button>
              </Card>
            ) : (
              events.map(event => <EventCard key={event.id} event={event} statistics={statistics} />)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Geen events in afwachting.</p>
              </Card>
            ) : (
              pendingEvents.map(event => <EventCard key={event.id} event={event} statistics={statistics} />)
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Nog geen goedgekeurde events.</p>
              </Card>
            ) : (
              approvedEvents.map(event => <EventCard key={event.id} event={event} statistics={statistics} />)
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Geen afgewezen events.</p>
              </Card>
            ) : (
              rejectedEvents.map(event => <EventCard key={event.id} event={event} statistics={statistics} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EventCard({ event, statistics }: { event: Event; statistics: any }) {
  const stats = statistics?.eventStats?.[event.id];
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-gray-900">{event.title}</h3>
              <Badge
                variant={
                  event.status === 'approved' ? 'default' :
                  event.status === 'pending' ? 'secondary' :
                  'destructive'
                }
              >
                {event.status === 'approved' && <><CheckCircle2 size={14} className="mr-1" /> Goedgekeurd</>}
                {event.status === 'pending' && <><Clock size={14} className="mr-1" /> In afwachting</>}
                {event.status === 'rejected' && <><XCircle size={14} className="mr-1" /> Afgewezen</>}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.startDate).toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <img 
            src={event.image} 
            alt={event.title}
            className="w-24 h-24 object-cover rounded-lg ml-4"
          />
        </div>

        {event.status === 'approved' && stats && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <Eye size={16} className="mr-1" />
                  <span className="text-sm">Bekeken</span>
                </div>
                <p className="text-xl">{stats.views || 0}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-green-600 mb-1">
                  <Ticket size={16} className="mr-1" />
                  <span className="text-sm">Verkocht</span>
                </div>
                <p className="text-xl">{stats.ticketsSold || 0}</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center bg-orange-50 rounded-lg p-3 border-2 border-orange-200 cursor-help relative">
                      <div className="flex items-center justify-center text-orange-700 mb-1">
                        <CheckCircle2 size={16} className="mr-1" />
                        <span className="text-sm">Gebruikt</span>
                      </div>
                      <p className="text-xl text-orange-900">{stats.ticketsUsed || 0}</p>
                      {stats.ticketsSold > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          {Math.round((stats.ticketsUsed / stats.ticketsSold) * 100)}% van verkocht
                        </p>
                      )}
                      {stats.ticketsUsed > 0 && (
                        <div className="absolute -top-2 -right-2">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Aantal tickets dat door klanten is gemarkeerd als gebruikt. Deze tickets zijn niet meer zichtbaar in hun "Mijn Tickets" overzicht.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-center">
                <div className="flex items-center justify-center text-purple-600 mb-1">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-sm">Omzet</span>
                </div>
                <p className="text-xl">€{stats.revenue || 0}</p>
              </div>
            </div>
          </div>
        )}

        {event.status === 'rejected' && event.rejectionReason && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              <strong>Reden afwijzing:</strong> {event.rejectionReason}
            </AlertDescription>
          </Alert>
        )}

        {event.status === 'pending' && (
          <Alert className="mt-4">
            <AlertDescription>
              Je event wordt momenteel beoordeeld door een beheerder. Je ontvangt een melding zodra er een beslissing is genomen.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}