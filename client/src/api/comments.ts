import api from './axios';
import { Comment, CommentFormData } from '@/types';

export const commentsApi = {
  async getBlogComments(blogId: number): Promise<Comment[]> {
    const response = await api.get(`/blogs/${blogId}/comments/`);
    return response.data;
  },

  async createComment(blogId: number, data: CommentFormData): Promise<Comment> {
    const response = await api.post(`/blogs/${blogId}/comments/`, data);
    return response.data;
  },

  async updateComment(id: number, data: CommentFormData): Promise<Comment> {
    const response = await api.put(`/comments/${id}/`, data);
    return response.data;
  },

  async deleteComment(id: number): Promise<void> {
    await api.delete(`/comments/${id}/`);
  },
};

