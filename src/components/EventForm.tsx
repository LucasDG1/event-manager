import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { X, Calendar, User, Users, Image, AlertTriangle, Euro } from 'lucide-react';
import type { Event } from '../types';

interface EventFormProps {
  event?: Event | null;
  onSubmit: (event: Omit<Event, 'id' | 'isPast'>) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate ? event.startDate.slice(0, 16) : '',
    endDate: event?.endDate ? event.endDate.slice(0, 16) : '',
    presenter: event?.presenter || '',
    totalPlaces: event?.totalPlaces || 50,
    bookedPlaces: event?.bookedPlaces || 0,
    price: event?.price || 50.00,
    image: event?.image || 'https://images.unsplash.com/photo-1740441155833-6696bfec1350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBldmVudCUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzU4ODc2ODM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Titel is verplicht';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Beschrijving is verplicht';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Startdatum is verplicht';
    } else if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = 'Startdatum moet in de toekomst liggen';
    }
    
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Einddatum moet na startdatum liggen';
    }
    
    if (!formData.presenter.trim()) {
      newErrors.presenter = 'Presentator is verplicht';
    }
    
    if (formData.totalPlaces < 1) {
      newErrors.totalPlaces = 'Minimaal 1 plaats vereist';
    } else if (formData.totalPlaces > 1000) {
      newErrors.totalPlaces = 'Maximaal 1000 plaatsen toegestaan';
    }
    
    if (formData.bookedPlaces < 0) {
      newErrors.bookedPlaces = 'Geboekte plaatsen kan niet negatief zijn';
    } else if (formData.bookedPlaces > formData.totalPlaces) {
      newErrors.bookedPlaces = 'Geboekte plaatsen kan niet meer zijn dan totaal aantal plaatsen';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Prijs moet groter zijn dan €0.00';
    } else if (formData.price > 10000) {
      newErrors.price = 'Prijs kan niet hoger zijn dan €10.000';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Afbeelding URL is verplicht';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Ongeldige URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = e.target.value;
    
    if (e.target.type === 'number') {
      if (field === 'price') {
        value = parseFloat(e.target.value) || 0;
      } else {
        value = parseInt(e.target.value) || 0;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset image preview error when URL changes
    if (field === 'image') {
      setImagePreviewError(false);
    }
  };

  const handleImageError = () => {
    setImagePreviewError(true);
  };

  const isEditing = !!event;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-blue-600" />
              {isEditing ? 'Event Bewerken' : 'Nieuw Event Aanmaken'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Titel *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange('title')}
                    placeholder="Bijv. Future of Technology Conference"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Beschrijving *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    placeholder="Beschrijf wat bezoekers kunnen verwachten..."
                    rows={3}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">Startdatum & tijd *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange('startDate')}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">Einddatum & tijd (optioneel)</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange('endDate')}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="presenter" className="flex items-center gap-2">
                    <User size={16} />
                    Presentator *
                  </Label>
                  <Input
                    id="presenter"
                    value={formData.presenter}
                    onChange={handleChange('presenter')}
                    placeholder="Naam van de presentator"
                    className={errors.presenter ? 'border-red-500' : ''}
                  />
                  {errors.presenter && (
                    <p className="text-red-500 text-sm mt-1">{errors.presenter}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="totalPlaces" className="flex items-center gap-2">
                    <Users size={16} />
                    Totaal aantal plaatsen *
                  </Label>
                  <Input
                    id="totalPlaces"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.totalPlaces}
                    onChange={handleChange('totalPlaces')}
                    className={errors.totalPlaces ? 'border-red-500' : ''}
                  />
                  {errors.totalPlaces && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalPlaces}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <Euro size={16} />
                    Prijs per ticket *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      max="10000"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange('price')}
                      className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="50.00"
                    />
                  </div>
                  {errors.price ? (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Prijs inclusief BTW en servicekosten
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="md:col-span-2">
                    <Label htmlFor="bookedPlaces">Reeds geboekte plaatsen</Label>
                    <Input
                      id="bookedPlaces"
                      type="number"
                      min="0"
                      max={formData.totalPlaces}
                      value={formData.bookedPlaces}
                      onChange={handleChange('bookedPlaces')}
                      className={errors.bookedPlaces ? 'border-red-500' : ''}
                    />
                    {errors.bookedPlaces && (
                      <p className="text-red-500 text-sm mt-1">{errors.bookedPlaces}</p>
                    )}
                    {formData.bookedPlaces > 0 && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Let op: Het wijzigen van geboekte plaatsen kan invloed hebben op bestaande boekingen.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <Image size={16} />
                    Afbeelding URL *
                  </Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange('image')}
                    placeholder="https://images.unsplash.com/..."
                    className={errors.image ? 'border-red-500' : ''}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                  
                  {formData.image && !imagePreviewError && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Voorbeeld:</p>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  {imagePreviewError && (
                    <p className="text-red-500 text-sm mt-1">
                      Kan afbeelding niet laden. Controleer de URL.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isEditing ? 'Bijwerken...' : 'Aanmaken...') 
                    : (isEditing ? 'Event Bijwerken' : 'Event Aanmaken')
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}