import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { SecurityBadge } from './SecurityBadge';
import { CalendarDays, Users, Sparkles, Eye, EyeOff, ArrowLeft, User, Briefcase } from 'lucide-react';
import { authApi } from '../services/api';
import type { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User, session: any) => void;
  onBackToWebsite?: () => void;
  isAdminLogin?: boolean;
}

export function AuthPage({ onLoginSuccess, onBackToWebsite, isAdminLogin = false }: AuthPageProps) {
  const [accountType, setAccountType] = useState<'user' | 'creator' | null>(isAdminLogin ? null : null);
  const [mode, setMode] = useState<'login' | 'signup'>(isAdminLogin ? 'login' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Admin login check (hardcoded)
      if (isAdminLogin && email === 'admin@event.com' && password === 'admin123') {
        onLoginSuccess({ 
          id: '1', 
          email, 
          role: 'admin', 
          name: 'Admin'
        }, null);
        setIsLoading(false);
        return;
      }
      
      if (mode === 'login') {
        const { user, session } = await authApi.login(email, password, accountType || 'user');
        onLoginSuccess(user, session);
      } else {
        if (!name.trim()) {
          setError('Naam is verplicht');
          setIsLoading(false);
          return;
        }
        const { user, session } = await authApi.signup(email, password, name, accountType || 'user');
        onLoginSuccess(user, session);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Er is een fout opgetreden');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const { url } = await authApi.signInWithGoogle();
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login mislukt');
    }
  };

  const handleDemoLogin = () => {
    if (isAdminLogin) {
      setEmail('admin@event.com');
      setPassword('admin123');
    }
    setError('');
  };

  // Show account type selection first (for non-admin)
  if (!isAdminLogin && accountType === null) {
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

        <div className="w-full max-w-2xl relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Back button */}
          {onBackToWebsite && (
            <button
              onClick={() => onBackToWebsite()}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Ga terug naar website
            </button>
          )}

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CalendarDays className="text-white" size={32} />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kies je accounttype
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Selecteer hoe je wilt inloggen
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setAccountType('user')}
                  className="group p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                      <User className="text-blue-600 group-hover:text-white" size={32} />
                    </div>
                    <h3 className="text-gray-900">Login als Gebruiker</h3>
                    <p className="text-sm text-gray-600">
                      Boek tickets en bekijk je boekingen
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setAccountType('creator')}
                  className="group p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 group-hover:bg-purple-500 rounded-full flex items-center justify-center transition-colors">
                      <Briefcase className="text-purple-600 group-hover:text-white" size={32} />
                    </div>
                    <h3 className="text-gray-900">Login als Event Creator</h3>
                    <p className="text-sm text-gray-600">
                      Maak en beheer je eigen events
                    </p>
                  </div>
                </button>
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
        {/* Back button */}
        {(onBackToWebsite || !isAdminLogin || accountType) && (
          <button
            onClick={() => {
              if (accountType && !isAdminLogin) {
                setAccountType(null);
              } else {
                onBackToWebsite?.();
              }
            }}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            {accountType && !isAdminLogin ? 'Kies ander accounttype' : 'Ga terug naar website'}
          </button>
        )}

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-105 ${
              isAdminLogin 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                : accountType === 'creator'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600'
            }`}>
              {isAdminLogin ? (
                <CalendarDays className="text-white" size={32} />
              ) : accountType === 'creator' ? (
                <Briefcase className="text-white" size={32} />
              ) : (
                <User className="text-white" size={32} />
              )}
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isAdminLogin 
                ? 'Event Manager CMS' 
                : accountType === 'creator'
                  ? (mode === 'login' ? 'Creator Login' : 'Creator Registratie')
                  : (mode === 'login' ? 'Welkom terug!' : 'Account aanmaken')}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isAdminLogin 
                ? 'Beheer je events en boekingen professioneel' 
                : accountType === 'creator'
                  ? (mode === 'login' ? 'Log in om je events te beheren' : 'Maak een account om events aan te maken')
                  : (mode === 'login' ? 'Log in om je tickets te bekijken' : 'Maak een account om tickets te boeken')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Je volledige naam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'signup'}
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isAdminLogin ? "admin@event.com" : "jouw@email.nl"}
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
                    placeholder={isAdminLogin ? "admin123" : "Minimaal 6 tekens"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

              <SecurityBadge variant="minimal" className="justify-center" />

              <Button 
                type="submit" 
                className={`w-full h-12 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  accountType === 'creator' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Bezig...' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
              </Button>

              {isAdminLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline"
                  >
                    Demo inloggegevens gebruiken
                  </button>
                </div>
              )}

              {!isAdminLogin && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Of</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Doorgaan met Google
                  </Button>

                  <div className="text-center text-sm">
                    {mode === 'login' ? (
                      <>
                        Nog geen account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('signup')}
                          className="text-blue-600 hover:text-blue-800 transition-colors underline"
                        >
                          Account aanmaken
                        </button>
                      </>
                    ) : (
                      <>
                        Heb je al een account?{' '}
                        <button
                          type="button"
                          onClick={() => setMode('login')}
                          className="text-blue-600 hover:text-blue-800 transition-colors underline"
                        >
                          Inloggen
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </form>

            {!isAdminLogin && (
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
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in-0 delay-300">
          © 2025 Event Manager. Professioneel event beheer.
        </div>
      </div>
    </div>
  );
}