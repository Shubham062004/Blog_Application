import React, { useState } from 'react';
import { Blog } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { likesApi } from '@/api/likes';
import { wishlistApi } from '@/api/wishlist';

interface BlogCardProps {
  blog: Blog;
  onUpdate?: (updatedBlog: Blog) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(blog.is_liked || false);
  const [isWishlisted, setIsWishlisted] = useState(blog.is_wishlisted || false);
  const [likeCount, setLikeCount] = useState(blog.likes_count);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to like posts.',
        variant: 'destructive',
      });
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await likesApi.toggleLike(blog.id);
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      if (onUpdate) {
        onUpdate({
          ...blog,
          is_liked: newIsLiked,
          likes_count: newIsLiked ? blog.likes_count + 1 : blog.likes_count - 1
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to save posts.',
        variant: 'destructive',
      });
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await wishlistApi.toggleWishlist(blog.id);
      const newIsWishlisted = !isWishlisted;
      setIsWishlisted(newIsWishlisted);
      
      toast({
        title: newIsWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
        description: response.message,
      });
      
      if (onUpdate) {
        onUpdate({
          ...blog,
          is_wishlisted: newIsWishlisted
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: `${window.location.origin}/blog/${blog.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.id}`);
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard.',
      });
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to comment.',
        variant: 'destructive',
      });
      return;
    }
    
    // Navigate to blog detail with focus on comments
    window.location.href = `/blog/${blog.id}#comments`;
  };

  return (
    <Card className="card-hover group h-full flex flex-col overflow-hidden">
      {/* Cover Image */}
      {blog.image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${blog.image}`} 
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={blog.author.profile_image} alt={blog.author.name || blog.author.username} />
              <AvatarFallback>
                {blog.author.name?.split(' ').map(n => n[0]).join('') || blog.author.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{blog.author.name || blog.author.username}</p>
              <p className="text-muted-foreground">{formatDate(blog.created_at)}</p>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
            <Link to={`/blog/${blog.id}`}>
              {blog.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
              {blog.excerpt}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <button
              onClick={handleComment}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{blog.comments_count}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleWishlist}
            disabled={isLoading}
            className={`transition-colors ${
              isWishlisted ? 'text-amber-600' : 'text-muted-foreground hover:text-foreground'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;