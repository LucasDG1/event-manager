import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { QrCode, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { QRCode } from '../types';

interface QRCodeDisplayProps {
  qrCodes: QRCode[];
  eventTitle: string;
  onClose?: () => void;
}

export function QRCodeDisplay({ qrCodes, eventTitle, onClose }: QRCodeDisplayProps) {
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);

  const downloadQRCode = (qr: QRCode) => {
    try {
      const link = document.createElement('a');
      link.href = qr.qrCodeDataUrl;
      link.download = `ticket-${qr.ticketNumber}-${eventTitle.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Ticket ${qr.ticketNumber} QR code gedownload`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Kon QR code niet downloaden');
    }
  };

  const testValidation = (qr: QRCode) => {
    window.open(qr.validationUrl, '_blank');
    toast.info('QR code validatie getest - check de admin dashboard');
  };

  return (
    <Card className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="text-purple-600" />
          Jouw QR Codes
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              ✕
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            🎫 <strong>Jouw Tickets:</strong> Deze QR codes zijn ook verzonden naar je e-mailadres. 
            Je kunt ze hier downloaden of testen. Bij het event scan je de QR code voor toegang.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrCodes.map((qr) => (
            <Card 
              key={qr.ticketId} 
              className={`p-4 text-center transition-all duration-200 ${
                selectedQR?.ticketId === qr.ticketId 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md hover:scale-105'
              }`}
            >
              <h4 className="font-semibold mb-3 text-gray-900">
                Ticket {qr.ticketNumber}
              </h4>
              
              <div 
                className="cursor-pointer mb-4 inline-block border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-white"
                onClick={() => testValidation(qr)}
                title="Klik om QR code validatie te testen"
              >
                <img 
                  src={qr.qrCodeDataUrl} 
                  alt={`QR Code Ticket ${qr.ticketNumber}`}
                  className="w-32 h-32 mx-auto"
                  onError={(e) => {
                    console.error('QR code image failed to load:', qr.qrCodeDataUrl);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4OFY4OEg0MFY0MFoiIGZpbGw9IiM5Y2EzYWYiLz4KPHRleHQgeD0iNjQiIHk9IjEwNCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
              
              <div className="text-xs text-gray-600 space-y-1 mb-4">
                <p><strong>Ticket ID:</strong></p>
                <p className="font-mono text-xs break-all bg-gray-100 p-1 rounded">
                  {qr.ticketId}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => downloadQRCode(qr)}
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => testValidation(qr)}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Test Validatie
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {qrCodes.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✅ Succesvol Geboekt!</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Je tickets zijn bevestigd en QR codes zijn gegenereerd</li>
              <li>• Een bevestigingsmail is verzonden naar je e-mailadres</li>
              <li>• Download de QR codes of bewaar de e-mail voor toegang</li>
              <li>• Bij het event: scan de QR code bij de ingang</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}