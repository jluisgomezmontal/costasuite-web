'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFormData } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertySchema } from '@/lib/validations/property';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PropertyFormData) => Promise<void>;
  property?: Property;
}

export function PropertyModal({ open, onClose, onSave, property }: PropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    type: 'sale',
    status: 'available',
    price: 0,
    location: {
      address: '',
      city: '',
      state: '',
      country: 'México',
      postalCode: '',
      coordinates: { lat: 16.8531, lng: -99.8237 },
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      parkingSpots: 0,
      yearBuilt: new Date().getFullYear(),
    },
    images: [],
    amenities: [],
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        type: property.type,
        status: property.status,
        price: property.price,
        location: property.location,
        features: property.features,
        images: property.images,
        amenities: property.amenities,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = propertySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path.join('.')] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      toast.error('Error al guardar la propiedad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'sale' | 'rent') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Venta</SelectItem>
                    <SelectItem value="rent">Renta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'available' | 'sold' | 'rented') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="sold">Vendida</SelectItem>
                    <SelectItem value="rented">Rentada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ubicación</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal *</Label>
              <Input
                id="postalCode"
                value={formData.location.postalCode}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, postalCode: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Habitaciones *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.features.bedrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    features: { ...formData.features, bedrooms: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Baños *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  value={formData.features.bathrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    features: { ...formData.features, bathrooms: Number(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  value={formData.features.area}
                  onChange={(e) => setFormData({
                    ...formData,
                    features: { ...formData.features, area: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Images (simplified) */}
          <div className="space-y-2">
            <Label htmlFor="images">URLs de Imágenes (separadas por coma) *</Label>
            <Textarea
              id="images"
              rows={3}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              value={formData.images.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                images: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
              })}
            />
            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
          </div>

          {/* Amenities (simplified) */}
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenidades (separadas por coma) *</Label>
            <Textarea
              id="amenities"
              rows={3}
              placeholder="WiFi, Piscina, Gimnasio"
              value={formData.amenities.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                amenities: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
              })}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
