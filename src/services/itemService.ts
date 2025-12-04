import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Level {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}

export interface KitchenItem {
  id: number;
  name: string;
  level: Level;
  category: Category;
  admin: Admin;
}

export interface ItemCreateDto {
  name: string;
  levelId: number;
  categoryId: number;
  adminId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const itemService = {
  getAll: async (search?: string, page = 1, limit = 10): Promise<PaginatedResponse<KitchenItem>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`${API_ENDPOINTS.items}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<KitchenItem> => {
    const response = await api.get(`${API_ENDPOINTS.items}/${id}`);
    return response.data;
  },

  create: async (data: ItemCreateDto): Promise<KitchenItem> => {
    const response = await api.post(API_ENDPOINTS.items, data);
    return response.data;
  },

  update: async (id: number, data: Partial<ItemCreateDto>): Promise<KitchenItem> => {
    const response = await api.put(`${API_ENDPOINTS.items}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.items}/${id}`);
  },
};

