import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Category {
  id: number;
  name: string;
  items?: any[];
}

export interface CategoryCreateDto {
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const categoryService = {
  getAll: async (search?: string, page = 1, limit = 10): Promise<PaginatedResponse<Category>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`${API_ENDPOINTS.categories}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`${API_ENDPOINTS.categories}/${id}`);
    return response.data;
  },

  create: async (data: CategoryCreateDto): Promise<Category> => {
    const response = await api.post(API_ENDPOINTS.categories, data);
    return response.data;
  },

  update: async (id: number, data: Partial<CategoryCreateDto>): Promise<Category> => {
    const response = await api.put(`${API_ENDPOINTS.categories}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.categories}/${id}`);
  },
};

