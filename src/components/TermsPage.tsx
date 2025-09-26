import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Scale, 
  CreditCard, 
  AlertTriangle, 
  Shield, 
  Mail,
  Calendar,
  Users
} from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Scale size={40} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6">Algemene Voorwaarden</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              De voorwaarden voor het gebruik van Event Manager en onze diensten
            </p>
            <Badge variant="secondary" className="mt-4 bg-white/20 text-white border-white/30">
              Laatst bijgewerkt: 26 september 2025
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Important Notice */}
        <Alert className="mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Door gebruik te maken van Event Manager ga je akkoord met deze algemene voorwaarden. 
            Lees ze zorgvuldig door voordat je onze diensten gebruikt.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                1. Definities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Event Manager</h4>
                  <p className="text-sm text-muted-foreground">
                    Het online platform voor event management, beheerd door Event Manager B.V.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Gebruiker</h4>
                  <p className="text-sm text-muted-foreground">
                    Iedere persoon die gebruik maakt van onze diensten, inclusief bezoekers en organisatoren.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Event</h4>
                  <p className="text-sm text-muted-foreground">
                    Elke activiteit, bijeenkomst of voorstelling die via ons platform wordt aangeboden.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Boeking</h4>
                  <p className="text-sm text-muted-foreground">
                    Het reserveren van één of meerdere tickets voor een event via ons platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-purple-600" />
                2. Account en Gebruik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Account aanmaken</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Je moet 18 jaar of ouder zijn om een account aan te maken</li>
                  <li>Je bent verantwoordelijk voor het verstrekken van juiste informatie</li>
                  <li>Eén persoon mag slechts één account hebben</li>
                  <li>Je bent verantwoordelijk voor het beveiligen van je account gegevens</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Toegestaan gebruik</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Het platform gebruiken voor het boeken van legitieme events</li>
                  <li>Respectvol communiceren met andere gebruikers</li>
                  <li>Je houden aan alle toepasselijke wetten en regelgeving</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Verboden gebruik</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Het verstrekken van valse of misleidende informatie</li>
                  <li>Het gebruik maken van geautomatiseerde systemen (bots)</li>
                  <li>Het verstoren van de werking van het platform</li>
                  <li>Het schenden van intellectuele eigendomsrechten</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-green-600" />
                3. Event Boekingen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Boekingsproces</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Boekingen zijn definitief na bevestiging en betaling</li>
                  <li>Je ontvangt een bevestigingsmail met je ticket informatie</li>
                  <li>Controleer altijd je ticket gegevens na ontvangst</li>
                  <li>Breng je ticket (digitaal of geprint) mee naar het event</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Annulering door de gebruiker</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-orange-800">
                    <strong>Annuleringsbeleid:</strong> Gratis annulering tot 48 uur voor het event. 
                    Daarna zijn kosten verschuldigd.
                  </p>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Meer dan 48 uur voor het event: 100% restitutie</li>
                  <li>24-48 uur voor het event: 50% restitutie</li>
                  <li>Minder dan 24 uur voor het event: geen restitutie</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Annulering door de organisator</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Bij annulering ontvang je 100% restitutie</li>
                  <li>We streven ernaar je binnen 5 werkdagen te informeren</li>
                  <li>Restitutie wordt verwerkt naar je originele betaalmethode</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-blue-600" />
                4. Betaling en Prijzen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Prijzen en kosten</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Alle prijzen zijn inclusief BTW, tenzij anders vermeld</li>
                  <li>Prijzen kunnen wijzigen zonder voorafgaande kennisgeving</li>
                  <li>Er kunnen extra servicekosten worden toegepast</li>
                  <li>De totaalprijs wordt altijd getoond voor bevestiging</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Betaalmethoden</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>iDEAL, creditcards (Visa, Mastercard)</li>
                  <li>PayPal en andere digitale betaalmiddelen</li>
                  <li>Alle betalingen worden veilig verwerkt</li>
                  <li>Betaling is vereist om je boeking te bevestigen</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Restituties</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Restituties worden verwerkt naar je originele betaalmethode</li>
                  <li>Het kan 5-10 werkdagen duren voordat het bedrag op je rekening staat</li>
                  <li>Bij technische problemen nemen we direct contact op</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-purple-600" />
                5. Aansprakelijkheid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Onze aansprakelijkheid</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>We streven naar 99,5% uptime van ons platform</li>
                  <li>We zijn niet aansprakelijk voor de kwaliteit van events</li>
                  <li>Organisatoren zijn verantwoordelijk voor hun eigen events</li>
                  <li>Onze totale aansprakelijkheid is beperkt tot het ticketbedrag</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Jouw verantwoordelijkheden</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Je gebruikt het platform op eigen risico</li>
                  <li>Je bent verantwoordelijk voor je eigen veiligheid tijdens events</li>
                  <li>Je houdt je aan de regels van individuele events</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Overmacht</h4>
                <p className="text-sm text-red-700">
                  We zijn niet aansprakelijk voor situaties buiten onze controle, zoals natuurrampen, 
                  technische storingen van derden, of overheidsmaatregelen (zoals COVID-19 restricties).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            <CardHeader>
              <CardTitle>6. Intellectueel Eigendom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Onze rechten</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Het Event Manager platform en alle content zijn ons eigendom</li>
                  <li>Je mag geen content kopiëren zonder toestemming</li>
                  <li>Onze logo's en merknamen zijn beschermde handelsmerken</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content die je upload</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Je blijft eigenaar van content die je upload</li>
                  <li>Je geeft ons toestemming om je content te gebruiken op ons platform</li>
                  <li>Je garandeert dat je content geen rechten van derden schendt</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800">
            <CardHeader>
              <CardTitle>7. Geschillen en Toepasselijk Recht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Geschillen oplossen</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>We proberen geschillen altijd eerst onderling op te lossen</li>
                  <li>Neem contact op via onze klantenservice</li>
                  <li>Bij aanhoudende problemen kun je gebruik maken van mediation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Toepasselijk recht</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Nederlands recht is van toepassing</li>
                  <li>Geschillen worden voorgelegd aan de rechtbank Amsterdam</li>
                  <li>Consumenten kunnen altijd hun eigen rechtbank kiezen</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900">
            <CardHeader>
              <CardTitle>8. Wijzigingen en Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Wijzigingen in voorwaarden</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>We kunnen deze voorwaarden wijzigen</li>
                  <li>Belangrijke wijzigingen kondigen we 30 dagen van tevoren aan</li>
                  <li>Door verder gebruik te maken ga je akkoord met wijzigingen</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    <span className="text-sm">legal@eventmanager.nl</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    <span className="text-sm">Event Manager B.V.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    <span className="text-sm">KvK: 12345678, BTW: NL123456789B01</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    <span className="text-sm">Damrak 1, 1012 LG Amsterdam</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in-0 duration-700 delay-1000">
          <p>Deze algemene voorwaarden zijn voor het laatst bijgewerkt op 26 september 2025.</p>
          <p>Eerdere versies zijn op verzoek beschikbaar via legal@eventmanager.nl</p>
        </div>
      </div>
    </div>
  );
}