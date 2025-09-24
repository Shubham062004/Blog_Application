import api from './axios';
import { WishlistItem } from '@/types';

export const wishlistApi = {
  async toggleWishlist(blogId: number): Promise<{ message: string }> {
    const response = await api.post(`/blogs/${blogId}/wishlist/`);
    return response.data;
  },

  async getUserWishlist(): Promise<WishlistItem[]> {
    const response = await api.get('/wishlist/');
    return response.data;
  },
};

