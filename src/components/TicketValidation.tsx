import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { qrApi } from '../services/api';

interface TicketValidationProps {
  ticketId: string;
  onBack: () => void;
}

export function TicketValidation({ ticketId, onBack }: TicketValidationProps) {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    validateTicket();
  }, [ticketId]);

  const validateTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎫 Validating ticket:', ticketId);
      const result = await qrApi.validateTicket(ticketId);
      
      setValidationResult(result);
      
      if (result.success) {
        console.log('✅ Ticket validated successfully');
      } else {
        console.log('❌ Ticket validation failed:', result.error);
      }
      
    } catch (err) {
      console.error('Error validating ticket:', err);
      setError('Er is een fout opgetreden bij het valideren van het ticket');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ticket wordt gevalideerd...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Terug naar overzicht
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-in fade-in-0 slide-in-from-left-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationResult?.success ? (
                  <>
                    <CheckCircle className="text-green-600" />
                    Ticket Gevalideerd
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-600" />
                    Validatie Mislukt
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              ) : validationResult?.success ? (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Ticket succesvol gevalideerd! De bezoeker mag naar binnen.
                    </AlertDescription>
                  </Alert>
                  
                  {validationResult.ticketInfo && (
                    <div className="bg-white border rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-gray-900">Ticket Informatie</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Ticket ID:</strong> {validationResult.ticketInfo.ticketId}</p>
                        <p><strong>Boeking ID:</strong> {validationResult.ticketInfo.bookingId}</p>
                        <p><strong>Ticket:</strong> {validationResult.ticketInfo.ticketNumber} van {validationResult.ticketInfo.totalTickets}</p>
                        <p><strong>Aangemaakt:</strong> {formatDateTime(validationResult.ticketInfo.createdAt)}</p>
                        <p><strong>Gevalideerd:</strong> {formatDateTime(validationResult.ticketInfo.usedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {validationResult?.error === 'Ticket already used' 
                        ? 'Dit ticket is al eerder gebruikt en is niet meer geldig.'
                        : validationResult?.error === 'Ticket not found'
                        ? 'Dit ticket bestaat niet of is ongeldig.'
                        : validationResult?.error || 'Onbekende validatiefout'}
                    </AlertDescription>
                  </Alert>

                  {validationResult?.error === 'Ticket already used' && validationResult?.usedAt && (
                    <div className="bg-white border rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-gray-900">Ticket Status</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Status:</strong> <span className="text-red-600">Gebruikt</span></p>
                        <p><strong>Gebruikt op:</strong> {formatDateTime(validationResult.usedAt)}</p>
                        <p><strong>Ticket ID:</strong> {ticketId}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={validateTicket}
                  variant="outline"
                  className="flex-1"
                >
                  Opnieuw Valideren
                </Button>
                <Button
                  onClick={onBack}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Terug
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-0 slide-in-from-right-4 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-blue-600" />
                Validatie Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ticket ID</h4>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded border break-all">
                    {ticketId}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Validatie Tijd</h4>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(new Date().toISOString())}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Validatie Proces</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Ticket ID geverifieerd</li>
                    <li>✓ Database gecontroleerd</li>
                    <li>✓ Status bijgewerkt</li>
                    {validationResult?.success && <li>✓ Toegang verleend</li>}
                  </ul>
                </div>

                {validationResult?.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Welkom bij het event!</strong><br />
                      Dit ticket is nu gemarkeerd als gebruikt en kan niet opnieuw worden gescand.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}