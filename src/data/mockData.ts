import type { Event, Booking } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Future of Technology Conference',
    description: 'Ontdek de nieuwste trends in technologie met experts uit de industrie. Van kunstmatige intelligentie tot blockchain, van cybersecurity tot quantum computing - alle grote technologie trends komen aan bod in deze inspirerende dag vol met presentaties, workshops en netwerkmogelijkheden.',
    startDate: '2025-10-15T09:00:00',
    endDate: '2025-10-15T17:00:00',
    presenter: 'Dr. Sarah Johnson',
    totalPlaces: 150,
    bookedPlaces: 135,
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1740441155833-6696bfec1350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBldmVudCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzU4ODc2ODM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isPast: false
  },
  {
    id: '2',
    title: 'Digital Marketing Workshop',
    description: 'Leer de basis van digitale marketing in deze interactieve workshop. Perfect voor ondernemers en marketingprofessionals die hun online aanwezigheid willen versterken.',
    startDate: '2025-10-20T10:00:00',
    endDate: '2025-10-20T16:00:00',
    presenter: 'Mark van der Berg',
    totalPlaces: 50,
    bookedPlaces: 50,
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU4NzY2NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isPast: false
  },
  {
    id: '3',
    title: 'AI & Machine Learning Summit',
    description: 'Een diepgaande verkenning van AI en machine learning toepassingen in het bedrijfsleven. Leer van experts hoe je AI succesvol implementeert in je organisatie.',
    startDate: '2025-11-05T09:30:00',
    endDate: '2025-11-05T18:00:00',
    presenter: 'Prof. Lisa Chen',
    totalPlaces: 200,
    bookedPlaces: 45,
    price: 175.00,
    image: 'https://images.unsplash.com/photo-1600320261634-78edd477fa1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHNwZWFrZXJzfGVufDF8fHx8MTc1ODc4NjE3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isPast: false
  },
  {
    id: '4',
    title: 'Leadership Development Training',
    description: 'Ontwikkel je leiderschapsvaardigheden met praktische oefeningen en real-world cases. Ideaal voor managers en aspirant-leiders die hun team naar een hoger niveau willen tillen.',
    startDate: '2025-11-12T09:00:00',
    endDate: '2025-11-12T17:30:00',
    presenter: 'Jan Pieters',
    totalPlaces: 30,
    bookedPlaces: 18,
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRyYWluaW5nJTIwc2Vzc2lvbnxlbnwxfHx8fDE3NTg4NjI1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isPast: false
  },
  {
    id: '5',
    title: 'Sustainable Business Practices',
    description: 'Leer hoe je duurzaamheid integreert in je bedrijfsstrategie. Van ESG rapportage tot circulaire economie - alle aspecten van duurzaam ondernemen komen aan bod.',
    startDate: '2025-11-20T13:00:00',
    endDate: '2025-11-20T18:00:00',
    presenter: 'Emma van Dijk',
    totalPlaces: 80,
    bookedPlaces: 22,
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    isPast: false
  },
  {
    id: '6',
    title: 'Cybersecurity Essentials',
    description: 'Bescherm je bedrijf tegen cyberdreigingen. Een praktische workshop over de nieuwste beveiligingstechnieken en best practices voor IT-beveiliging.',
    startDate: '2025-12-03T09:00:00',
    endDate: '2025-12-03T17:00:00',
    presenter: 'Alex Rodriguez',
    totalPlaces: 40,
    bookedPlaces: 8,
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    isPast: false
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    eventId: '1',
    name: 'Anna de Vries',
    email: 'anna@example.com',
    ticketCount: 2,
    totalPrice: 250.00,
    bookingDate: '2025-09-15T14:30:00'
  },
  {
    id: '2',
    eventId: '3',
    name: 'Pieter Janssen',
    email: 'pieter@example.com',
    ticketCount: 1,
    totalPrice: 175.00,
    bookingDate: '2025-09-20T10:15:00'
  }
];