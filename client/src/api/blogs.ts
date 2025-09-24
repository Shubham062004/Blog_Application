import api from './axios';
import { Blog, BlogListResponse, BlogFormData } from '@/types';

export const blogsApi = {
  async getBlogs(page = 1, pageSize = 5): Promise<BlogListResponse> {
    const response = await api.get(`/blogs/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async getBlog(id: number): Promise<Blog> {
    const response = await api.get(`/blogs/${id}/`);
    return response.data;
  },

  async createBlog(data: BlogFormData): Promise<Blog> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/blogs/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateBlog(id: number, data: BlogFormData): Promise<Blog> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.put(`/blogs/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteBlog(id: number): Promise<void> {
    await api.delete(`/blogs/${id}/`);
  },
};