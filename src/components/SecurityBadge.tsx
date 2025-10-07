import { Shield, Lock, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SecurityBadgeProps {
  variant?: 'minimal' | 'detailed';
  className?: string;
}

export function SecurityBadge({ variant = 'minimal', className = '' }: SecurityBadgeProps) {
  const securityFeatures = [
    'SSL/TLS Encryptie',
    'Content Security Policy',
    'XSS Bescherming',
    'CSRF Bescherming',
    'Veilige Headers',
    'Data Encryptie'
  ];

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 ${className}`}>
              <Shield size={14} className="text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-700 dark:text-green-300">
                Beveiligd
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">Deze site is beveiligd met:</p>
              <ul className="space-y-1 text-xs">
                {securityFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1.5">
                    <Check size={12} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Lock size={24} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
            <Shield size={18} className="text-green-600 dark:text-green-400" />
            Jouw gegevens zijn veilig
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-4">
            We gebruiken industriestandaard beveiligingsmaatregelen om jouw persoonlijke informatie en betalingsgegevens te beschermen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                <Check size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
