'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Property } from '@/types';
import { propertyService } from '@/lib/api/property.service';
import { 
  Bed, 
  Bath, 
  Maximize, 
  Car, 
  MapPin, 
  Calendar,
  Home,
  Mail,
  Phone,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadProperty(params.id as string);
    }
  }, [params.id]);

  const loadProperty = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (error) {
      toast.error('Error al cargar la propiedad');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-[500px] w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
            <Link href="/propiedades">
              <Button>Ver todas las propiedades</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const typeLabel = property.type === 'sale' ? 'Venta' : 'Renta';
  const statusLabel = {
    available: 'Disponible',
    sold: 'Vendida',
    rented: 'Rentada',
  }[property.status];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/propiedades">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a propiedades
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-[500px] rounded-lg overflow-hidden mb-4">
            <Image
              src={property.images[selectedImage] || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 rounded overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${property.title} - ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Price */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={property.type === 'sale' ? 'default' : 'secondary'}>
                  {typeLabel}
                </Badge>
                <Badge variant={property.status === 'available' ? 'default' : 'outline'}>
                  {statusLabel}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(property.price)}
                {property.type === 'rent' && <span className="text-xl font-normal">/mes</span>}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">{property.location.address}</p>
                <p>{property.location.city}, {property.location.state}, {property.location.country}</p>
                <p className="text-sm">CP: {property.location.postalCode}</p>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                  <Bed className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{property.features.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Habitaciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                  <Bath className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{property.features.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Baños</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                  <Maximize className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{property.features.area}</p>
                    <p className="text-sm text-muted-foreground">m²</p>
                  </div>
                </div>
                {property.features.parkingSpots && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                    <Car className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{property.features.parkingSpots}</p>
                      <p className="text-sm text-muted-foreground">Estacionamientos</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Amenidades</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">¿Interesado en esta propiedad?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contáctanos para más información o para agendar una visita
                  </p>
                </div>

                <Button className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </Button>

                <Button className="w-full" size="lg" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar Ahora
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span>ID: {property.id.slice(-8)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Publicado: {new Date(property.createdAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  {property.features.yearBuilt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Año de construcción: {property.features.yearBuilt}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
