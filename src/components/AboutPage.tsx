import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SecurityBadge } from './SecurityBadge';
import { CalendarDays, Users, Target, Award, Heart, Zap } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Heart size={40} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6">Over Event Manager</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Wij maken event management eenvoudig, efficiënt en toegankelijk voor iedereen
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700">
            <h2 className="text-3xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Onze Missie
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Event Manager is geboren uit de behoefte aan een eenvoudige, maar krachtige oplossing voor event management. 
              Wij geloven dat het organiseren van events niet complex hoeft te zijn.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Onze missie is om organisatoren en deelnemers een naadloze ervaring te bieden, van het aanmaken van events 
              tot het boeken van tickets en het beheren van alle aspecten van je event.
            </p>
          </div>
          
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-200">
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-2xl mb-2">500+</h3>
                    <p className="text-muted-foreground">Events georganiseerd</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-2xl mb-2">10.000+</h3>
                    <p className="text-muted-foreground">Tevreden deelnemers</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-2xl mb-2">98%</h3>
                    <p className="text-muted-foreground">Tevredenheidscore</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="text-orange-600" size={32} />
                    </div>
                    <h3 className="text-2xl mb-2">50+</h3>
                    <p className="text-muted-foreground">Partners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Onze Kernwaarden
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Deze waarden staan centraal in alles wat we doen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <CardTitle>Eenvoud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maken complexe processen eenvoudig en intuïtief. Onze gebruikersinterface is ontworpen 
                  met de gebruiker in gedachten.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="text-purple-600" size={24} />
                </div>
                <CardTitle>Betrouwbaarheid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We staan voor kwaliteit en betrouwbaarheid. Onze systemen zijn robuust en 
                  onze service is altijd beschikbaar wanneer je ons nodig hebt.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-green-600" size={24} />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We geloven in de kracht van gemeenschap. Events brengen mensen samen 
                  en wij faciliteren die verbindingen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ons Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Een toegewijd team van professionals met passie voor events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">SJ</span>
                </div>
                <h3 className="text-xl mb-2">Sarah Johnson</h3>
                <Badge variant="secondary" className="mb-4">CEO & Founder</Badge>
                <p className="text-muted-foreground">
                  10+ jaar ervaring in event management en technologie. Visionaire leider 
                  met passie voor innovatie.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">MB</span>
                </div>
                <h3 className="text-xl mb-2">Mark van den Berg</h3>
                <Badge variant="secondary" className="mb-4">CTO</Badge>
                <p className="text-muted-foreground">
                  Expert in software architectuur en gebruikerservaring. Zorgt ervoor dat onze 
                  technologie altijd up-to-date is.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">LC</span>
                </div>
                <h3 className="text-xl mb-2">Lisa Chen</h3>
                <Badge variant="secondary" className="mb-4">Head of Operations</Badge>
                <p className="text-muted-foreground">
                  Specialiteit in procesoptimalisatie en klantenservice. Zorgt voor een 
                  vlekkeloze gebruikerservaring.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-16">
          <SecurityBadge variant="detailed" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000" />
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1100">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl mb-4">Klaar om te beginnen?</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Ontdek hoe Event Manager jouw events naar het volgende niveau kan tillen. 
              Neem contact met ons op voor een persoonlijke demonstratie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = 'mailto:info@eventmanager.nl'}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Opnemen
              </button>
              <button 
                onClick={() => window.location.href = 'tel:+31201234567'}
                className="border border-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Bel Ons
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}