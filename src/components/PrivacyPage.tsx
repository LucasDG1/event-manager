import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield size={40} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6">Privacy Beleid</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Jouw privacy is belangrijk voor ons. Hier leggen we uit hoe we je gegevens gebruiken en beschermen.
            </p>
            <Badge variant="secondary" className="mt-4 bg-white/20 text-white border-white/30">
              Laatst bijgewerkt: 26 september 2025
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="text-blue-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Veilige Opslag</h3>
              <p className="text-sm text-muted-foreground">
                Alle gegevens worden veilig opgeslagen met moderne encryptie
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="text-green-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Transparantie</h3>
              <p className="text-sm text-muted-foreground">
                We zijn transparant over welke gegevens we verzamelen en waarom
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-purple-600" size={24} />
              </div>
              <h3 className="font-medium mb-2">Jouw Rechten</h3>
              <p className="text-sm text-muted-foreground">
                Je hebt volledige controle over je persoonlijke gegevens
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-blue-600" />
                1. Welke gegevens verzamelen we?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Persoonlijke informatie</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Naam en e-mailadres bij het boeken van tickets</li>
                  <li>Contactgegevens bij het aanmaken van een account</li>
                  <li>Betalingsinformatie voor ticketaankopen</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Technische gegevens</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>IP-adres en browserinformatie</li>
                  <li>Cookies voor website functionaliteit</li>
                  <li>Gebruiksstatistieken (anoniem)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            <CardHeader>
              <CardTitle>2. Hoe gebruiken we je gegevens?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Primaire doeleinden</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Het verwerken van je event boekingen</li>
                  <li>Het versturen van bevestigings- en herinneringsemails</li>
                  <li>Het bieden van klantenservice en support</li>
                  <li>Het verbeteren van onze diensten</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Communicatie</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Belangrijke updates over je boekingen</li>
                  <li>Nieuwsbrieven (alleen met je toestemming)</li>
                  <li>Technische meldingen over onze service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
            <CardHeader>
              <CardTitle>3. Delen we je gegevens?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Kort antwoord: Nee.</strong> We verkopen of verhuren je persoonlijke gegevens nooit aan derden.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Uitzonderingen</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Bij wettelijke verplichtingen</li>
                  <li>Met je expliciete toestemming</li>
                  <li>Met vertrouwde serviceproviders (onder strikte voorwaarden)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            <CardHeader>
              <CardTitle>4. Hoe beschermen we je gegevens?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Technische beveiliging</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>SSL/TLS encryptie voor alle datatransmissie</li>
                  <li>Regelmatige beveiligingsupdates en patches</li>
                  <li>Beperkte toegang tot persoonlijke gegevens</li>
                  <li>Regelmatige beveiligingsaudits</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Organisatorische maatregelen</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Privacy training voor alle medewerkers</li>
                  <li>Strikte toegangscontroles</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800">
            <CardHeader>
              <CardTitle>5. Jouw rechten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Je hebt het recht om:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Inzage te krijgen in je persoonlijke gegevens</li>
                  <li>Je gegevens te corrigeren of aan te vullen</li>
                  <li>Je gegevens te laten verwijderen</li>
                  <li>Bezwaar te maken tegen verwerking</li>
                  <li>Je gegevens over te dragen</li>
                  <li>Je toestemming in te trekken</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Wil je gebruik maken van je rechten?</strong> Neem contact met ons op via 
                  <a href="mailto:privacy@eventmanager.nl" className="underline ml-1">
                    privacy@eventmanager.nl
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900">
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Welke cookies gebruiken we?</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium text-sm">Noodzakelijke cookies</h5>
                    <p className="text-xs text-muted-foreground">Voor basis website functionaliteit</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-sm">Functionele cookies</h5>
                    <p className="text-xs text-muted-foreground">Voor verbeterde gebruikerservaring</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-medium text-sm">Analytische cookies</h5>
                    <p className="text-xs text-muted-foreground">Voor website statistieken (anoniem)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000">
            <CardHeader>
              <CardTitle>7. Contact & Vragen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Heb je vragen over dit privacy beleid of over hoe we je gegevens verwerken? 
                Neem gerust contact met ons op.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span className="text-sm">privacy@eventmanager.nl</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" />
                  <span className="text-sm">Event Manager B.V., Damrak 1, 1012 LG Amsterdam</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens 
                als je vindt dat we niet goed omgaan met je persoonlijke gegevens.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in-0 duration-700 delay-1100">
          <p>Dit privacy beleid is voor het laatst bijgewerkt op 26 september 2025.</p>
          <p>We kunnen dit beleid van tijd tot tijd aanpassen. Wijzigingen worden op deze pagina gepubliceerd.</p>
        </div>
      </div>
    </div>
  );
}