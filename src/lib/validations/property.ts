import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const locationSchema = z.object({
  address: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El estado es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  postalCode: z.string().min(1, 'El código postal es requerido'),
  coordinates: coordinatesSchema,
});

const featuresSchema = z.object({
  bedrooms: z.number().min(1, 'Debe tener al menos 1 habitación'),
  bathrooms: z.number().min(1, 'Debe tener al menos 1 baño'),
  area: z.number().min(1, 'El área debe ser mayor a 0'),
  parkingSpots: z.number().min(0).optional(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
});

export const propertySchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  type: z.enum(['sale', 'rent']),
  status: z.enum(['available', 'sold', 'rented']),
  price: z.number().min(1, 'El precio debe ser mayor a 0'),
  location: locationSchema,
  features: featuresSchema,
  images: z.array(z.string().url()).min(1, 'Debe agregar al menos una imagen'),
  amenities: z.array(z.string()).min(1, 'Debe agregar al menos una amenidad'),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const propertyFilterSchema = z.object({
  type: z.enum(['sale', 'rent', 'all']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  city: z.string().optional(),
  bedrooms: z.number().optional(),
  search: z.string().optional(),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;
