import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarDays, Sparkles, Search, Filter } from 'lucide-react';
import type { Event } from '../types';

interface EventsOverviewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function EventsOverview({ events, onEventClick }: EventsOverviewProps) {
  const [visibleEvents, setVisibleEvents] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const upcomingEvents = events.filter(event => !event.isPast);

  useEffect(() => {
    let filtered = upcomingEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.presenter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'availability':
          const aAvailable = a.totalPlaces - a.bookedPlaces;
          const bAvailable = b.totalPlaces - b.bookedPlaces;
          return bAvailable - aAvailable;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [upcomingEvents, searchTerm, sortBy]);

  const displayedEvents = filteredEvents.slice(0, visibleEvents);

  const loadMore = () => {
    setVisibleEvents(prev => Math.min(prev + 8, filteredEvents.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CalendarDays size={40} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
              Ontdek Geweldige Events
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
              Van technologie conferenties tot leadership workshops - vind het perfecte event voor jouw ontwikkeling
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-white/20 animate-pulse">
          <Sparkles size={60} />
        </div>
        <div className="absolute bottom-20 right-10 text-white/20 animate-pulse delay-200">
          <Sparkles size={80} />
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Zoek events, presentators of onderwerpen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Sorteer op..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Datum</SelectItem>
                  <SelectItem value="title">Titel</SelectItem>
                  <SelectItem value="availability">Beschikbaarheid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Aankomende Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event gevonden' : 'events gevonden'}
            {searchTerm && ` voor "${searchTerm}"`}
          </p>
        </div>

        {/* Events Grid */}
        {displayedEvents.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in-0 duration-500">
            <CalendarDays size={80} className="mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl text-muted-foreground mb-4">
              {searchTerm ? 'Geen events gevonden' : 'Geen events beschikbaar'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Probeer een andere zoekterm of wijzig de filters.'
                : 'Er zijn momenteel geen aankomende events beschikbaar.'
              }
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')} 
                variant="outline" 
                className="mt-4"
              >
                Toon alle events
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EventCard 
                    event={event} 
                    onClick={() => onEventClick(event)}
                  />
                </div>
              ))}
            </div>

            {visibleEvents < filteredEvents.length && (
              <div className="text-center animate-in fade-in-0 duration-500 delay-700">
                <Button 
                  onClick={loadMore}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300"
                >
                  Meer Events Laden ({filteredEvents.length - visibleEvents} over)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}