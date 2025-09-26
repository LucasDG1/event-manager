import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CalendarDays, User, Users, AlertTriangle, Clock, Euro } from 'lucide-react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  showFullDetails?: boolean;
}

export function EventCard({ event, onClick, showFullDetails = false }: EventCardProps) {
  const availablePlaces = event.totalPlaces - event.bookedPlaces;
  const isAlmostFull = availablePlaces <= event.totalPlaces * 0.1;
  const isFull = availablePlaces <= 0;
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('nl-NL', {
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

  const handleClick = () => {
    if (!isFull && onClick) {
      onClick();
    }
  };

  const cardContent = (
    <Card className={`overflow-hidden transition-all duration-300 h-full ${
      isFull 
        ? 'opacity-75 cursor-not-allowed' 
        : onClick 
          ? 'hover:shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
          : ''
    }`}>
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
          }}
        />
        {isFull && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="px-4 py-2 text-base">
              VOLGEBOEKT
            </Badge>
          </div>
        )}
        {isAlmostFull && !isFull && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
              <AlertTriangle size={14} />
              Bijna vol
            </Badge>
          </div>
        )}
        {!isAlmostFull && !isFull && availablePlaces > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Beschikbaar
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="mb-3 line-clamp-2">{event.title}</h3>
          
          {showFullDetails && (
            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
              {event.description}
            </p>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={16} className="text-blue-600 flex-shrink-0" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-purple-600 flex-shrink-0" />
              <span>
                {formatTime(event.startDate)}
                {event.endDate && ` - ${formatTime(event.endDate)}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-orange-600 flex-shrink-0" />
              <span className="line-clamp-1">{event.presenter}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className={`flex-shrink-0 ${
                isFull ? 'text-red-600' : isAlmostFull ? 'text-orange-600' : 'text-green-600'
              }`} />
              <span>
                {availablePlaces} van {event.totalPlaces} plaatsen
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Euro size={16} className="text-blue-600 flex-shrink-0" />
              <span className="font-medium">€{event.price.toFixed(2)} per ticket</span>
            </div>
          </div>
        </div>

        {!showFullDetails && (
          <div className="mt-4 pt-4 border-t">
            {isFull ? (
              <p className="text-sm text-red-600 text-center font-medium">
                Dit event is volgeboekt
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Klik voor meer details en boeken
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div onClick={handleClick} className="h-full">
      {cardContent}
    </div>
  );
}