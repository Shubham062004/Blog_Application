import api from './axios';
import { User, AuthRequest, RegisterRequest } from '@/types';

export const authApi = {
  async login(data: AuthRequest): Promise<User> {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },
};