'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters, FilterValues } from '@/components/PropertyFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Property } from '@/types';
import { propertyService } from '@/lib/api/property.service';
import { toast } from 'sonner';

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});

  useEffect(() => {
    loadProperties(filters);
  }, []);

  const loadProperties = async (filterValues: FilterValues) => {
    try {
      setIsLoading(true);
      const data = await propertyService.getAll(filterValues);
      setProperties(data);
    } catch (error) {
      toast.error('Error al cargar propiedades');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filterValues: FilterValues) => {
    setFilters(filterValues);
    loadProperties(filterValues);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Propiedades Disponibles</h1>
          <p className="text-lg text-muted-foreground">
            Explora nuestra selección de propiedades en zonas costeras
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <PropertyFilters onFilter={handleFilter} />
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  No se encontraron propiedades con los filtros seleccionados
                </p>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
