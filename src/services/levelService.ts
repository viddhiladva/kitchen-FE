import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Level {
  id: number;
  name: string;
  items?: any[];
}

export interface LevelCreateDto {
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const levelService = {
  getAll: async (search?: string, page = 1, limit = 10): Promise<PaginatedResponse<Level>> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`${API_ENDPOINTS.levels}?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Level> => {
    const response = await api.get(`${API_ENDPOINTS.levels}/${id}`);
    return response.data;
  },

  create: async (data: LevelCreateDto): Promise<Level> => {
    const response = await api.post(API_ENDPOINTS.levels, data);
    return response.data;
  },

  update: async (id: number, data: Partial<LevelCreateDto>): Promise<Level> => {
    const response = await api.put(`${API_ENDPOINTS.levels}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.levels}/${id}`);
  },
};

