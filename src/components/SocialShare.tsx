import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import {
  generateFacebookShareUrl,
  generateTwitterShareUrl,
  generateLinkedInShareUrl,
  generateEmailShareUrl,
  copyToClipboard,
  nativeShare,
  isNativeShareAvailable,
  type ShareConfig
} from '../utils/socialShare';

interface SocialShareProps {
  config: ShareConfig;
  variant?: 'buttons' | 'dropdown' | 'compact';
  className?: string;
}

export function SocialShare({ config, variant = 'buttons', className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    const success = await nativeShare(config);
    if (success) {
      toast.success('Succesvol gedeeld!');
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(config.url);
    if (success) {
      setCopied(true);
      toast.success('Link gekopieerd naar klembord!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Kon link niet kopiëren');
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-[#1877F2] hover:text-white',
      url: generateFacebookShareUrl(config)
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-[#1DA1F2] hover:text-white',
      url: generateTwitterShareUrl(config)
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-[#0A66C2] hover:text-white',
      url: generateLinkedInShareUrl(config)
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-[#EA4335] hover:text-white',
      url: generateEmailShareUrl(config)
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isNativeShareAvailable() ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2"
          >
            <Share2 size={16} />
            Delen
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            {shareButtons.map((button) => {
              const Icon = button.icon;
              return (
                <a
                  key={button.name}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border border-gray-200 transition-all duration-200 ${button.color}`}
                  title={`Delen op ${button.name}`}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-600" />
              Gekopieerd
            </>
          ) : (
            <>
              <LinkIcon size={16} />
              Link
            </>
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'dropdown') {
    // TODO: Implement dropdown variant with shadcn DropdownMenu
    return <div>Dropdown variant (to be implemented)</div>;
  }

  // Default: buttons variant
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700">Deel dit event</h3>
      
      {/* Native Share Button (Mobile) */}
      {isNativeShareAvailable() && (
        <Button
          variant="outline"
          onClick={handleNativeShare}
          className="w-full gap-2 hover:bg-blue-50"
        >
          <Share2 size={20} />
          Delen via...
        </Button>
      )}

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {shareButtons.map((button) => {
          const Icon = button.icon;
          return (
            <a
              key={button.name}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 transition-all duration-200 ${button.color} hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{button.name}</span>
            </a>
          );
        })}
      </div>

      {/* Copy Link Button */}
      <Button
        variant="outline"
        onClick={handleCopyLink}
        className="w-full gap-2 hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check size={20} className="text-green-600" />
            Link gekopieerd!
          </>
        ) : (
          <>
            <LinkIcon size={20} />
            Kopieer link
          </>
        )}
      </Button>
    </div>
  );
}

// Compact inline share buttons for use in cards
export function InlineShareButtons({ config }: { config: ShareConfig }) {
  return <SocialShare config={config} variant="compact" />;
}
