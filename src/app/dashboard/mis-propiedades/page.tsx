'use client';

import { useEffect, useState } from 'react';
import { PropertyModal } from '@/components/dashboard/PropertyModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Property, PropertyFormData } from '@/types';
import { propertyService } from '@/lib/api/property.service';
import { Plus, Edit, Trash2, Bed, Bath, Maximize } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getMyProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Error al cargar propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: PropertyFormData) => {
    try {
      if (selectedProperty) {
        await propertyService.update(selectedProperty.id, data);
        toast.success('Propiedad actualizada exitosamente');
      } else {
        await propertyService.create(data);
        toast.success('Propiedad creada exitosamente');
      }
      loadProperties();
      setModalOpen(false);
      setSelectedProperty(undefined);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la propiedad');
      throw error;
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    try {
      await propertyService.delete(id);
      toast.success('Propiedad eliminada exitosamente');
      loadProperties();
    } catch (error) {
      toast.error('Error al eliminar la propiedad');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Propiedades</h1>
          <p className="text-muted-foreground">
            Administra tus propiedades publicadas
          </p>
        </div>
        <Button onClick={() => {
          setSelectedProperty(undefined);
          setModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                      {property.type === 'sale' ? 'Venta' : 'Renta'}
                    </Badge>
                    <Badge variant={property.status === 'available' ? 'default' : 'outline'}>
                      {property.status === 'available' ? 'Disponible' :
                       property.status === 'sold' ? 'Vendida' : 'Rentada'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(property.price)}
                    {property.type === 'rent' && <span className="text-sm font-normal">/mes</span>}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.location.city}, {property.location.state}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.features.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.features.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.features.area} m²</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(property)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              No tienes propiedades publicadas
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear tu primera propiedad
            </Button>
          </CardContent>
        </Card>
      )}

      <PropertyModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProperty(undefined);
        }}
        onSave={handleSave}
        property={selectedProperty}
      />
    </div>
  );
}
