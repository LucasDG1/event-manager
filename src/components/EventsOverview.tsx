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
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ontdek Fantastische Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Boek veilig en eenvoudig tickets voor de beste evenementen in Nederland
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#upcoming-events" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Bekijk Events
            </a>
            <a href="#categories" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Categorieën
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Populaire Categorieën</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => setSelectedCategory('Muziek')} className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
              <span className="text-3xl mb-2 block">🎵</span>
              <span className="font-semibold">Muziek</span>
            </button>
            <button onClick={() => setSelectedCategory('Sport')} className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all">
              <span className="text-3xl mb-2 block">⚽</span>
              <span className="font-semibold">Sport</span>
            </button>
            <button onClick={() => setSelectedCategory('Kunst')} className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
              <span className="text-3xl mb-2 block">🎨</span>
              <span className="font-semibold">Kunst</span>
            </button>
            <button onClick={() => setSelectedCategory('Tech')} className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
              <span className="text-3xl mb-2 block">💻</span>
              <span className="font-semibold">Tech</span>
            </button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="upcoming-events" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Section */}
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
      </section>

      {/* Footer CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Mis geen enkel evenement meer</h2>
          <p className="text-xl mb-8 opacity-90">
            Blijf op de hoogte van de nieuwste events en ontvang exclusieve aanbiedingen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Jouw email adres"
              className="px-6 py-3 rounded-lg w-full sm:w-96 text-gray-900"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
              Aanmelden
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}