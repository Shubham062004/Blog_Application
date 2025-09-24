import api from './axios';
import { User } from '@/types';

export interface UserProfileData {
  name?: string;
  email?: string;
  profile_image?: File | null;
}

export const userApi = {
  async getProfile(): Promise<User> {
    const response = await api.get('/user/me/');
    return response.data;
  },

  async updateProfile(data: UserProfileData): Promise<User> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.profile_image) formData.append('profile_image', data.profile_image);

    const response = await api.put('/user/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

