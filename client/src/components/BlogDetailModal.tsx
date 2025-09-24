import React from 'react';
import { Blog } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogDetailModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ blog, isOpen, onClose }) => {
  if (!blog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading font-bold pr-8">
              {blog.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{blog.author.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Blog Post
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-6">
              {blog.excerpt}
            </p>
          )}
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailModal;