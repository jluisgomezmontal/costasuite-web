'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PropertyModal } from '@/components/dashboard/PropertyModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Property, PropertyFormData } from '@/types';
import { propertyService } from '@/lib/api/property.service';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties(searchTerm);
  }, [searchTerm, properties]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      toast.error('Error al cargar propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = (term: string) => {
    if (!term) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(term.toLowerCase()) ||
        p.location.city.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProperties(filtered);
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
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Propiedades</h1>
            <p className="text-muted-foreground">
              Administra todas las propiedades de la plataforma
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

        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>
                      {property.location.city}, {property.location.state}
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                        {property.type === 'sale' ? 'Venta' : 'Renta'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.status === 'available'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {property.status === 'available'
                          ? 'Disponible'
                          : property.status === 'sold'
                          ? 'Vendida'
                          : 'Rentada'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(property.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron propiedades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
    </ProtectedRoute>
  );
}
