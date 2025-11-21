import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0] || '/placeholder-property.jpg';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const typeLabel = property.type === 'sale' ? 'Venta' : 'Renta';
  const statusLabel = {
    available: 'Disponible',
    sold: 'Vendida',
    rented: 'Rentada',
  }[property.status];

  return (
    <Link href={`/propiedades/${property.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                {typeLabel}
              </Badge>
              <Badge variant={property.status === 'available' ? 'default' : 'outline'}>
                {statusLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {formatPrice(property.price)}
              {property.type === 'rent' && <span className="text-sm font-normal">/mes</span>}
            </p>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {property.location.city}, {property.location.state}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {property.description}
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
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
        </CardFooter>
      </Card>
    </Link>
  );
}
