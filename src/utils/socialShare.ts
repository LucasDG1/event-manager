/**
 * Social Media Share Utilities
 * 
 * Helper functions for generating social media share URLs with proper meta tag integration
 */

interface ShareConfig {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
}

/**
 * Generate Facebook share URL
 * Uses Open Graph meta tags automatically
 */
export function generateFacebookShareUrl(config: ShareConfig): string {
  const params = new URLSearchParams({
    u: config.url,
    quote: config.title + (config.description ? ` - ${config.description}` : '')
  });
  
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate Twitter/X share URL
 * Uses Twitter Card meta tags automatically
 */
export function generateTwitterShareUrl(config: ShareConfig): string {
  const text = config.title + (config.description ? `\n${config.description}` : '');
  const params = new URLSearchParams({
    url: config.url,
    text: text
  });
  
  if (config.hashtags && config.hashtags.length > 0) {
    params.append('hashtags', config.hashtags.join(','));
  }
  
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate LinkedIn share URL
 * Uses Open Graph meta tags automatically
 */
export function generateLinkedInShareUrl(config: ShareConfig): string {
  const params = new URLSearchParams({
    url: config.url
  });
  
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Generate WhatsApp share URL
 */
export function generateWhatsAppShareUrl(config: ShareConfig): string {
  const text = `${config.title}\n${config.description || ''}\n${config.url}`;
  const params = new URLSearchParams({
    text: text
  });
  
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Generate Email share URL
 */
export function generateEmailShareUrl(config: ShareConfig): string {
  const subject = config.title;
  const body = `${config.description || ''}\n\nBekijk hier: ${config.url}`;
  
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generate Telegram share URL
 */
export function generateTelegramShareUrl(config: ShareConfig): string {
  const text = `${config.title}\n${config.description || ''}\n${config.url}`;
  const params = new URLSearchParams({
    url: config.url,
    text: text
  });
  
  return `https://t.me/share/url?${params.toString()}`;
}

/**
 * Copy URL to clipboard
 * Useful for "Copy Link" functionality
 */
export async function copyToClipboard(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      textArea.remove();
      
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Use Web Share API if available (mobile devices)
 */
export async function nativeShare(config: ShareConfig): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: config.title,
        text: config.description,
        url: config.url
      });
      return true;
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed:', err);
      return false;
    }
  }
  
  return false;
}

/**
 * Check if Web Share API is available
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Generate event share config
 * Helper function for sharing events
 */
export function generateEventShareConfig(event: {
  id: string;
  title: string;
  description: string;
  image?: string;
}): ShareConfig {
  return {
    url: `https://eventmanager.nl/event/${event.id}`,
    title: `${event.title} - Event Manager`,
    description: event.description,
    image: event.image,
    hashtags: ['EventManager', 'Events', 'Nederland']
  };
}

/**
 * Social media share buttons data
 * Can be used to render share buttons
 */
export const socialPlatforms = [
  {
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    generateUrl: generateFacebookShareUrl
  },
  {
    name: 'Twitter',
    icon: 'twitter',
    color: '#1DA1F2',
    generateUrl: generateTwitterShareUrl
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    generateUrl: generateLinkedInShareUrl
  },
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    color: '#25D366',
    generateUrl: generateWhatsAppShareUrl
  },
  {
    name: 'Email',
    icon: 'mail',
    color: '#EA4335',
    generateUrl: generateEmailShareUrl
  },
  {
    name: 'Telegram',
    icon: 'send',
    color: '#0088CC',
    generateUrl: generateTelegramShareUrl
  }
] as const;

export type SocialPlatform = typeof socialPlatforms[number]['name'];
