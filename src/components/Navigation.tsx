import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { CalendarDays, Menu, X, Home, Info, Phone, Shield, FileText, LogOut, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'events' | 'about' | 'contact' | 'privacy' | 'terms' | 'login') => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Navigation({ currentPage, onNavigate, isAdmin, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (page: 'events' | 'about' | 'contact' | 'privacy' | 'terms' | 'login') => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { key: 'events', label: 'Events', icon: Home },
    { key: 'about', label: 'Over Ons', icon: Info },
    { key: 'contact', label: 'Contact', icon: Phone },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'terms', label: 'Voorwaarden', icon: FileText },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 mobile-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigate('events')}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <CalendarDays className="text-white" size={20} />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 hidden sm:block">
                Event Manager
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAdmin ? (
              <>
                {navigationItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={currentPage === item.key ? 'default' : 'ghost'}
                    onClick={() => handleNavigate(item.key as any)}
                    className="relative overflow-hidden transition-all duration-200 hover:scale-105"
                  >
                    <item.icon size={16} className="mr-2" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant={currentPage === 'login' ? 'default' : 'outline'}
                  onClick={() => handleNavigate('login')}
                  className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all duration-200 hover:scale-105"
                >
                  <User size={16} className="mr-2" />
                  Admin
                </Button>
              </>
            ) : (
              <Button 
                onClick={onLogout} 
                variant="outline"
                className="transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut size={16} className="mr-2" />
                Uitloggen
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 transition-all duration-200 hover:scale-105"
              aria-label="Toggle menu"
            >
              <div className="relative">
                <Menu 
                  size={24} 
                  className={`transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                />
                <X 
                  size={24} 
                  className={`absolute inset-0 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '64px' }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg transition-all duration-300 transform ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
        style={{ top: '64px' }}
      >
        <div className="px-4 py-6 space-y-2">
          {!isAdmin ? (
            <>
              {navigationItems.map((item, index) => (
                <Button
                  key={item.key}
                  variant={currentPage === item.key ? 'default' : 'ghost'}
                  onClick={() => handleNavigate(item.key as any)}
                  className={`w-full justify-start text-left transition-all duration-200 hover:scale-[1.02] animate-in slide-in-from-left-4`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant={currentPage === 'login' ? 'default' : 'outline'}
                  onClick={() => handleNavigate('login')}
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-all duration-200 hover:scale-[1.02] animate-in slide-in-from-left-4"
                  style={{ animationDelay: `${navigationItems.length * 50}ms` }}
                >
                  <User size={18} className="mr-3" />
                  Admin Login
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg animate-in slide-in-from-left-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={18} />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Admin Panel</p>
                  <p className="text-sm text-gray-500">Ingelogd als beheerder</p>
                </div>
              </div>
              
              <Button 
                onClick={onLogout} 
                variant="outline"
                className="w-full justify-start hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 hover:scale-[1.02] animate-in slide-in-from-left-4"
                style={{ animationDelay: '100ms' }}
              >
                <LogOut size={18} className="mr-3" />
                Uitloggen
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}