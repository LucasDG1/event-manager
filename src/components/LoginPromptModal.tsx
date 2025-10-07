import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { User, UserPlus } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export function LoginPromptModal({ isOpen, onClose, onLogin, onSignup }: LoginPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Account vereist
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Je moet ingelogd zijn om tickets te kunnen boeken. Log in met je bestaande account of maak een nieuwe aan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button
            onClick={onLogin}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <User size={18} className="mr-2" />
            Inloggen
          </Button>
          
          <Button
            onClick={onSignup}
            variant="outline"
            className="w-full h-12"
          >
            <UserPlus size={18} className="mr-2" />
            Account aanmaken
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Annuleren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}