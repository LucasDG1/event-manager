import { CalendarDays, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'events' | 'login' | 'about' | 'contact' | 'privacy' | 'terms') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CalendarDays className="text-white" size={20} />
              </div>
              <span className="ml-2 text-xl font-semibold">Event Manager</span>
            </div>
            <p className="text-gray-400 mb-4">
              De professionele oplossing voor event management. Organiseer, beheer en boek events met gemak.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://facebook.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => window.open('https://twitter.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </button>
              <button
                onClick={() => window.open('https://linkedin.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Alle Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Over Ons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Voorwaarden
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Beleid
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@eventmanager.nl" className="hover:text-white transition-colors">
                  info@eventmanager.nl
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <a href="tel:+31201234567" className="hover:text-white transition-colors">
                  +31 20 123 4567
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2" />
                <span>Amsterdam, Nederland</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Event Manager. Alle rechten voorbehouden.
              </p>
              <div className="flex items-center gap-2 text-green-400 text-xs bg-green-400/10 px-3 py-1 rounded-full">
                <Shield size={14} />
                <span>Beveiligde Verbinding</span>
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Voorwaarden
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}