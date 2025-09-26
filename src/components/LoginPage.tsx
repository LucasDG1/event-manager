import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CalendarDays, Users, Sparkles, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@event.com' && password === 'admin123') {
      onLogin(email, password);
    } else {
      setError('Ongeldige inloggegevens. Gebruik admin@event.com / admin123');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setEmail('admin@event.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-blue-200 animate-pulse">
          <CalendarDays size={60} />
        </div>
        <div className="absolute top-32 right-32 text-purple-200 animate-pulse delay-100">
          <Users size={50} />
        </div>
        <div className="absolute bottom-32 left-32 text-pink-200 animate-pulse delay-200">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-20 right-20 text-blue-300 animate-pulse delay-300">
          <CalendarDays size={45} />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <CalendarDays className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Event Manager CMS
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Beheer je events en boekingen professioneel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@event.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? 'Inloggen...' : 'Inloggen'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline"
                >
                  Demo inloggegevens gebruiken
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Hulp nodig?{' '}
                <button 
                  onClick={() => alert('Neem contact op via info@eventmanager.nl')}
                  className="text-blue-600 hover:text-blue-800 transition-colors underline"
                >
                  Contact support
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in-0 delay-300">
          © 2025 Event Manager. Professioneel event beheer.
        </div>
      </div>
    </div>
  );
}