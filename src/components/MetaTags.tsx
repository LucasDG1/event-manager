import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export function MetaTags({
  title = 'Event Manager - Ontdek en Boek Fantastische Events',
  description = 'Ontdek en boek de beste events in Nederland. Van muziekfestivals tot workshops, zakelijke conferenties tot culturele evenementen.',
  keywords = 'events, evenementen, tickets, boeken, festivals, workshops, conferenties, Nederland',
  ogTitle,
  ogDescription,
  ogImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop',
  ogUrl = 'https://eventmanager.nl/',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl = 'https://eventmanager.nl/',
  structuredData
}: MetaTagsProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (attribute: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', ogTitle || title);
    updateMetaTag('property', 'og:description', ogDescription || description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', ogUrl);

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:title', twitterTitle || ogTitle || title);
    updateMetaTag('name', 'twitter:description', twitterDescription || ogDescription || description);
    updateMetaTag('name', 'twitter:image', twitterImage || ogImage);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[data-dynamic-structured-data="true"]');
      
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        structuredDataScript.setAttribute('data-dynamic-structured-data', 'true');
        document.head.appendChild(structuredDataScript);
      }
      
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
    structuredData
  ]);

  return null; // This component doesn't render anything
}

// Helper function to generate event structured data
export function generateEventStructuredData(event: {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  price: number;
  image?: string;
  category: string;
  organizer?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location,
        addressCountry: 'NL'
      }
    },
    image: event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop',
    offers: {
      '@type': 'Offer',
      url: `https://eventmanager.nl/event/${event.id}`,
      price: event.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString()
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'Event Manager',
      url: 'https://eventmanager.nl'
    },
    performer: {
      '@type': 'PerformingGroup',
      name: event.organizer || 'Event Manager'
    }
  };
}
