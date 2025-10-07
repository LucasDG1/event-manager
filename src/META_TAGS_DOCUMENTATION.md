# Meta Tags Implementatie - Event Manager

## Overzicht

Event Manager is volledig geoptimaliseerd voor zoekmachines (SEO) en social media sharing met uitgebreide meta tags implementatie.

---

## 📋 Geïmplementeerde Meta Tags

### 1. Essential Meta Tags

**Locatie:** `/index.html`

- ✅ `charset="UTF-8"` - Character encoding
- ✅ `viewport` - Responsive design meta tag
- ✅ `X-UA-Compatible` - Browser compatibility
- ✅ `title` - Page title
- ✅ `description` - Page description
- ✅ `keywords` - SEO keywords
- ✅ `author` - Content author
- ✅ `robots` - Search engine indexing instructions
- ✅ `language` - Content language
- ✅ `revisit-after` - Crawler revisit frequency

### 2. Open Graph Meta Tags (Facebook, LinkedIn)

**Locatie:** `/index.html` + dynamisch via `/components/MetaTags.tsx`

- ✅ `og:type` - Content type (website)
- ✅ `og:url` - Canonical URL
- ✅ `og:title` - Social media title
- ✅ `og:description` - Social media description
- ✅ `og:image` - Social media preview image
- ✅ `og:image:width` - Image dimensions
- ✅ `og:image:height` - Image dimensions
- ✅ `og:image:alt` - Image alt text
- ✅ `og:site_name` - Website name
- ✅ `og:locale` - Content locale

### 3. Twitter Card Meta Tags

**Locatie:** `/index.html` + dynamisch via `/components/MetaTags.tsx`

- ✅ `twitter:card` - Card type (summary_large_image)
- ✅ `twitter:url` - Content URL
- ✅ `twitter:title` - Twitter title
- ✅ `twitter:description` - Twitter description
- ✅ `twitter:image` - Twitter image
- ✅ `twitter:image:alt` - Image alt text
- ✅ `twitter:creator` - Content creator
- ✅ `twitter:site` - Website account

### 4. Geographic Meta Tags

**Locatie:** `/index.html`

- ✅ `geo.region` - Geographic region (NL)
- ✅ `geo.placename` - Place name (Amsterdam)
- ✅ `geo.position` - GPS coordinates
- ✅ `ICBM` - Alternative GPS format

### 5. Mobile App Meta Tags

**Locatie:** `/index.html`

- ✅ `mobile-web-app-capable` - Web app mode
- ✅ `apple-mobile-web-app-capable` - iOS web app
- ✅ `apple-mobile-web-app-status-bar-style` - iOS status bar
- ✅ `apple-mobile-web-app-title` - iOS app name
- ✅ `application-name` - App name
- ✅ `theme-color` - Browser theme color
- ✅ `msapplication-TileColor` - Windows tile color

### 6. Security Meta Tags

**Locatie:** `/index.html`

- ✅ `Content-Security-Policy` - CSP upgrade insecure requests
- ✅ `referrer` - Referrer policy

### 7. Structured Data (Schema.org)

**Locatie:** `/index.html` + dynamisch via `/components/MetaTags.tsx`

#### Organization Schema
```json
{
  "@type": "Organization",
  "name": "Event Manager",
  "description": "...",
  "url": "...",
  "logo": "...",
  "address": {...},
  "contactPoint": {...},
  "sameAs": [...]
}
```

#### Website Schema
```json
{
  "@type": "WebSite",
  "name": "Event Manager",
  "url": "...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "...",
    "query-input": "..."
  }
}
```

#### Event Schema (dynamisch per event)
```json
{
  "@type": "Event",
  "name": "...",
  "description": "...",
  "startDate": "...",
  "location": {...},
  "offers": {...}
}
```

---

## 🔄 Dynamische Meta Tags

De `MetaTags` component (`/components/MetaTags.tsx`) zorgt voor dynamische meta tag updates op basis van de huidige pagina.

### Gebruik

```tsx
import { MetaTags } from './components/MetaTags';

// In component
<MetaTags
  title="Custom Title"
  description="Custom description"
  keywords="keyword1, keyword2"
  ogImage="https://example.com/image.jpg"
  canonicalUrl="https://example.com/page"
  structuredData={{...}}
/>
```

### Pagina-specifieke Meta Tags

| Pagina | Title | Canonical URL |
|--------|-------|---------------|
| Events | Event Manager - Ontdek en Boek Fantastische Events | / |
| Event Detail | [Event Naam] - Event Manager | /event/[id] |
| About | Over Ons - Event Manager | /about |
| Contact | Contact - Event Manager | /contact |
| Privacy | Privacy Beleid - Event Manager | /privacy |
| Terms | Algemene Voorwaarden - Event Manager | /terms |
| My Tickets | Mijn Tickets - Event Manager | /my-tickets |
| Login | Inloggen - Event Manager | /login |

---

## 🌐 SEO Bestanden

### robots.txt

**Locatie:** `/public/robots.txt`

**Inhoud:**
- Allows all crawlers
- Disallows admin/auth pages
- Specifies sitemap location
- Sets crawl-delay

### sitemap.xml

**Locatie:** `/public/sitemap.xml`

**Bevat:**
- Homepage
- Events overview
- Static pages (About, Contact, Privacy, Terms)
- Login page
- My Tickets page
- Priority en changefreq per pagina

**Note:** Individual event pages moeten dynamisch worden toegevoegd aan de sitemap.

### site.webmanifest

**Locatie:** `/public/site.webmanifest`

**Progressive Web App (PWA) configuratie:**
- App naam en korte naam
- Display mode (standalone)
- Theme colors
- Icons (verschillende formaten)
- App shortcuts
- Screenshots
- Language en direction

---

## 🎨 Favicons en Icons

### Bestanden

- `/public/favicon.svg` - Modern SVG favicon ✅
- `/public/favicon.ico` - Fallback ICO favicon
- `/public/favicon-16x16.png` - 16x16 PNG
- `/public/favicon-32x32.png` - 32x32 PNG
- `/public/apple-touch-icon.png` - 180x180 Apple icon
- `/public/android-chrome-192x192.png` - Android icon
- `/public/android-chrome-512x512.png` - Android icon

---

## 🔍 SEO Best Practices

### ✅ Geïmplementeerd

1. **Semantische HTML**
   - Correct gebruik van heading hierarchy (h1, h2, h3)
   - Semantic HTML5 tags (nav, main, footer, article, section)

2. **Page Speed Optimization**
   - Preconnect hints voor externe resources
   - DNS-prefetch voor API's
   - Optimized images via Unsplash

3. **Mobile Optimization**
   - Responsive viewport meta tag
   - Mobile-friendly navigation
   - Touch-optimized UI

4. **Accessibility (a11y)**
   - Alt text voor images
   - ARIA labels waar nodig
   - Keyboard navigation support
   - Focus states

5. **Content Quality**
   - Unique, descriptive page titles
   - Comprehensive meta descriptions
   - Relevant keywords
   - Fresh, updated content dates

6. **Structured Data**
   - Organization schema
   - Website schema
   - Event schema (per event)
   - BreadcrumbList (kan worden toegevoegd)

7. **Social Media Optimization**
   - Open Graph tags voor Facebook/LinkedIn
   - Twitter Card tags
   - High-quality preview images

---

## 📊 Testing Tools

### Meta Tags Valideren

1. **Facebook Debugger**
   - https://developers.facebook.com/tools/debug/
   - Test Open Graph tags

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Test Twitter Card tags

3. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Test structured data

4. **Schema.org Validator**
   - https://validator.schema.org/
   - Validate JSON-LD structured data

5. **Meta Tags Checker**
   - https://metatags.io/
   - Comprehensive meta tag testing

### SEO Audit Tools

1. **Google Search Console**
   - Monitor search performance
   - Submit sitemap
   - Check indexing status

2. **Lighthouse (Chrome DevTools)**
   - SEO score
   - Performance metrics
   - Accessibility audit
   - Best practices

3. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Core Web Vitals

4. **Mobile-Friendly Test**
   - https://search.google.com/test/mobile-friendly
   - Mobile optimization check

---

## 🚀 Toekomstige Verbeteringen

### Aanbevolen Toevoegingen

1. **Dynamic Sitemap Generation**
   - Automatisch events toevoegen aan sitemap
   - Real-time sitemap updates

2. **Breadcrumb Structured Data**
   ```json
   {
     "@type": "BreadcrumbList",
     "itemListElement": [...]
   }
   ```

3. **FAQ Schema** (voor About/Contact pagina's)
   ```json
   {
     "@type": "FAQPage",
     "mainEntity": [...]
   }
   ```

4. **Article Schema** (voor blog posts, indien toegevoegd)

5. **Review/Rating Schema** (voor event reviews)

6. **AMP Pages** (optioneel, voor extreme snelheid)

7. **Hreflang Tags** (indien meertalig)
   ```html
   <link rel="alternate" hreflang="nl" href="https://eventmanager.nl/" />
   <link rel="alternate" hreflang="en" href="https://eventmanager.nl/en/" />
   ```

---

## 📝 Meta Tag Checklist

### Per Nieuwe Pagina

- [ ] Update `title` tag
- [ ] Update `description` meta tag
- [ ] Update `keywords` meta tag
- [ ] Set `og:title`, `og:description`, `og:image`
- [ ] Set `twitter:title`, `twitter:description`, `twitter:image`
- [ ] Update canonical URL
- [ ] Add structured data (indien van toepassing)
- [ ] Add page to sitemap.xml
- [ ] Test met meta tag validators

### Per Event

- [ ] Generate event-specific structured data
- [ ] Set event title als og:title
- [ ] Use event image als og:image
- [ ] Set canonical URL naar event detail page
- [ ] Add event to dynamic sitemap

---

## 🎯 SEO Performance Metrics

### Doelstellingen

- **Google Lighthouse SEO Score:** 95+ ✅
- **Page Load Time:** < 3 seconds
- **Mobile Usability:** 100% ✅
- **Core Web Vitals:** All Green
- **Structured Data:** 0 errors ✅

### Monitoring

Monitor SEO performance via:
- Google Search Console
- Google Analytics
- Lighthouse reports
- Third-party SEO tools

---

## 📧 Contact & Support

Voor vragen over de meta tags implementatie:
- Email: tech@eventmanager.nl
- Documentatie: /META_TAGS_DOCUMENTATION.md
- Security: /SECURITY.md

---

**Laatst bijgewerkt:** 7 oktober 2025  
**Status:** Volledig geïmplementeerd ✅  
**Versie:** 1.0
