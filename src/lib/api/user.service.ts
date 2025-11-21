import api from './config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  createdAt: string;
  updatedAt: string;
  _count?: {
    properties: number;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'agent';
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  role?: 'admin' | 'agent';
}

export const userService = {
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get<{ success: boolean; data: UsersResponse }>('/users', { params });
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: CreateUserInput): Promise<User> => {
    const response = await api.post<{ success: boolean; data: User }>('/users', data);
    return response.data.data;
  },

  updateUser: async (id: string, data: UpdateUserInput): Promise<User> => {
    const response = await api.put<{ success: boolean; data: User }>(`/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ success: boolean; data: { message: string } }>(`/users/${id}`);
    return response.data.data;
  },
};
