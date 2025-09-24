import api from './axios';
import { Like } from '@/types';

export const likesApi = {
  async toggleLike(blogId: number): Promise<{ message: string }> {
    const response = await api.post(`/blogs/${blogId}/like/`);
    return response.data;
  },

  async getBlogLikes(blogId: number): Promise<Like[]> {
    const response = await api.get(`/blogs/${blogId}/likes/`);
    return response.data;
  },
};

