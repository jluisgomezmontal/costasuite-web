import api from './config';
import { Property, PropertyFormData } from '@/types';

export const propertyService = {
  getAll: async (filters?: Record<string, any>): Promise<Property[]> => {
    const response = await api.get<{success: boolean; data: {properties: Property[]}}>('/properties', {
      params: filters,
    });
    return response.data.data.properties;
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get<{success: boolean; data: Property}>(`/properties/${id}`);
    return response.data.data;
  },

  getMyProperties: async (): Promise<Property[]> => {
    const response = await api.get<{success: boolean; data: {properties: Property[]}}>('/properties/my-properties');
    return response.data.data.properties;
  },

  create: async (data: PropertyFormData): Promise<Property> => {
    const response = await api.post<{success: boolean; data: Property}>('/properties', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<PropertyFormData>): Promise<Property> => {
    const response = await api.put<{success: boolean; data: Property}>(`/properties/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};
