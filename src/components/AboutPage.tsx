import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SecurityBadge } from './SecurityBadge';
import { CalendarDays, Users, Target, Award, Heart, Zap } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Over Event Manager
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Onze Missie</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Event Manager maakt event management eenvoudig, efficiënt en toegankelijk voor iedereen.
            Of je nu een klein bedrijfsevenement organiseert of een groot festival plant, ons platform
            biedt alle tools die je nodig hebt.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Wat Wij Doen</h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">✓</span>
              <span className="text-gray-600">Veilige online <a href="/" className="text-blue-600 hover:underline">ticketverkoop</a> met directe bevestiging</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">✓</span>
              <span className="text-gray-600">Gebruiksvriendelijk <a href="/" className="text-blue-600 hover:underline">event overzicht</a> met zoek- en filtermogelijkheden</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">✓</span>
              <span className="text-gray-600">QR-code validatie voor <a href="/" className="text-blue-600 hover:underline">snelle toegangscontrole</a></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">✓</span>
              <span className="text-gray-600">Real-time notificaties en updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3">✓</span>
              <span className="text-gray-600">Uitgebreide analytics voor organisatoren</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-gray-900">Onze Waarden</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">🔒 Veiligheid</h3>
              <p className="text-gray-600 text-sm">
                Jouw gegevens en transacties zijn 100% veilig met ons AVG-compliant platform
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">🎯 Gebruiksgemak</h3>
              <p className="text-gray-600 text-sm">
                Intuïtieve interface voor zowel bezoekers als organisatoren
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">⚡ Efficiëntie</h3>
              <p className="text-gray-600 text-sm">
                Snelle ticketverkoop en real-time rapportages
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-orange-600 mb-2">💬 Support</h3>
              <p className="text-gray-600 text-sm">
                24/7 klantenservice voor al je vragen
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Heb je vragen?</h3>
            <p className="mb-4">Ons team staat voor je klaar!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Neem Contact Op
              </a>
              <a href="/" className="bg-transparent border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Bekijk Events
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}