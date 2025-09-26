import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    toast.success('Bericht verzonden! We nemen binnen 24 uur contact met je op.');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: ''
      });
    }, 3000);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageSquare size={40} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl mb-6">Contact</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We staan klaar om je te helpen. Neem contact met ons op voor vragen, support of samenwerking
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl mb-2">E-mail</h3>
              <p className="text-muted-foreground mb-4">
                Stuur ons een bericht en we reageren binnen 24 uur
              </p>
              <a 
                href="mailto:info@eventmanager.nl" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                info@eventmanager.nl
              </a>
            </CardContent>
          </Card>

          <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl mb-2">Telefoon</h3>
              <p className="text-muted-foreground mb-4">
                Bel ons voor directe hulp en support
              </p>
              <a 
                href="tel:+31201234567" 
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                +31 20 123 4567
              </a>
            </CardContent>
          </Card>

          <Card className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl mb-2">Kantoor</h3>
              <p className="text-muted-foreground mb-4">
                Bezoek ons op afspraak in het hart van Amsterdam
              </p>
              <address className="text-purple-600 not-italic">
                Damrak 1<br />
                1012 LG Amsterdam
              </address>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-400">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="text-blue-600" />
                  Stuur ons een bericht
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                    <h3 className="text-xl mb-2">Bericht verzonden!</h3>
                    <p className="text-muted-foreground">
                      Bedankt voor je bericht. We nemen binnen 24 uur contact met je op.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Naam *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleChange('name')}
                          required
                          placeholder="Je volledige naam"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange('email')}
                          required
                          placeholder="je@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Onderwerp categorie</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer een categorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Algemene vraag</SelectItem>
                          <SelectItem value="support">Technische support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="billing">Facturering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Onderwerp *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange('subject')}
                        required
                        placeholder="Waar kunnen we je mee helpen?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Bericht *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange('message')}
                        required
                        placeholder="Vertel ons meer over je vraag of opmerking..."
                        rows={5}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Verzenden...' : 'Bericht Verzenden'}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      Door dit formulier te verzenden ga je akkoord met ons{' '}
                      <button 
                        type="button" 
                        onClick={() => toast.info('Privacy beleid wordt binnenkort toegevoegd')}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        privacybeleid
                      </button>.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-8 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500">
            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Veelgestelde vragen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Hoe kan ik een event aanmaken?</h4>
                    <p className="text-sm text-muted-foreground">
                      Log in op het admin portal en klik op 'Nieuw Event' om je event aan te maken.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Kan ik mijn boeking annuleren?</h4>
                    <p className="text-sm text-muted-foreground">
                      Ja, neem contact met ons op via e-mail of telefoon om je boeking te annuleren.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Is er technische support beschikbaar?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absoluut! Ons support team is beschikbaar via e-mail en telefoon tijdens kantooruren.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-blue-600" />
                  Kantooruren
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Maandag - Vrijdag</span>
                    <span>09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zaterdag</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zondag</span>
                    <span>Gesloten</span>
                  </div>
                </div>
                <Alert className="mt-4">
                  <AlertDescription>
                    Voor urgente technische problemen zijn we 24/7 bereikbaar via e-mail.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Noodcontact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Voor kritieke problemen tijdens events:
                </p>
                <div className="space-y-2">
                  <a 
                    href="tel:+31612345678" 
                    className="flex items-center gap-2 text-red-800 hover:text-red-900"
                  >
                    <Phone size={16} />
                    +31 6 1234 5678 (24/7)
                  </a>
                  <a 
                    href="mailto:emergency@eventmanager.nl" 
                    className="flex items-center gap-2 text-red-800 hover:text-red-900"
                  >
                    <Mail size={16} />
                    emergency@eventmanager.nl
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-purple-600" />
              Ons Kantoor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4" />
                <p>Interactieve kaart</p>
                <p className="text-sm">Damrak 1, 1012 LG Amsterdam</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.open('https://maps.google.com?q=Damrak+1+Amsterdam', '_blank')}
                >
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}