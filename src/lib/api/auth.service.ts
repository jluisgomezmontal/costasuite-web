import api from './config';
import { AuthTokens } from '@/types';
import { LoginFormData } from '@/lib/validations/auth';

export const authService = {
  login: async (data: LoginFormData): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/login', data);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getStoredUser: () => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        console.warn('Error parsing user data from localStorage:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  },

  getStoredToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  storeAuth: (data: AuthTokens) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  },
};
