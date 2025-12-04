import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Admin {
  id: number;
  name: string;
  email: string;
  items?: any[];
}

export interface AdminCreateDto {
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const adminService = {
  getAll: async (search?: string, page = 1, limit = 10): Promise<PaginatedResponse<Admin>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`${API_ENDPOINTS.admins}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Admin> => {
    const response = await api.get(`${API_ENDPOINTS.admins}/${id}`);
    return response.data;
  },

  create: async (data: AdminCreateDto): Promise<Admin> => {
    const response = await api.post(API_ENDPOINTS.admins, data);
    return response.data;
  },

  update: async (id: number, data: Partial<AdminCreateDto>): Promise<Admin> => {
    const response = await api.put(`${API_ENDPOINTS.admins}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.admins}/${id}`);
  },
};

