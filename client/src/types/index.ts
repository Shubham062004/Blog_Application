export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  profile_image?: string;
  token?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  name?: string;
  password: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  author: {
    id: number;
    username: string;
    name?: string;
    profile_image?: string;
  };
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  is_wishlisted?: boolean;
}

export interface BlogFormData {
  title: string;
  content: string;
  image?: File | null;
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    name?: string;
    profile_image?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CommentFormData {
  content: string;
}

export interface Like {
  id: number;
  user: {
    id: number;
    username: string;
    name?: string;
    profile_image?: string;
  };
  created_at: string;
}

export interface WishlistItem {
  id: number;
  blog: Blog;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
}