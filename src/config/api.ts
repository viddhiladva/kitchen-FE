export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const API_ENDPOINTS = {
  levels: '/levels',
  categories: '/categories',
  admins: '/admins',
  items: '/items',
} as const;

