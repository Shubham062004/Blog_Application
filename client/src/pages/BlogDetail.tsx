import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Blog, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, Calendar, User, Heart, MessageCircle, Share2, Bookmark, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { mockBlogs, mockComments } from '@/lib/mockData';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // Mock data loading
    if (!id) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const foundBlog = mockBlogs.find(b => b.id === id);
      if (foundBlog) {
        setBlog(foundBlog);
        setComments(mockComments);
        setIsLiked(foundBlog.is_liked || false);
        setIsWishlisted(foundBlog.is_wishlisted || false);
        setLikeCount(foundBlog.like_count);
      } else {
        toast({
          title: 'Blog not found',
          description: 'The blog post you are looking for does not exist.',
          variant: 'destructive',
        });
        navigate('/');
      }
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!blog || !user) return;
    
    if (window.confirm('Are you sure you want to delete this blog?')) {
      toast({
        title: 'Blog deleted',
        description: 'Your blog has been successfully deleted.',
      });
      navigate('/');
    }
  };

  const handleLike = () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to like posts.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast({
      title: isLiked ? 'Removed from likes' : 'Added to likes',
      description: isLiked ? 'Post removed from your likes.' : 'Post added to your likes.',
    });
  };

  const handleWishlist = () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to save posts.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted ? 'Post removed from your wishlist.' : 'Post saved to your wishlist.',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard.',
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to comment.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        id: user.id,
        username: user.username,
        name: user.name,
        profile_photo_url: user.profile_photo_url,
      },
      created_at: new Date().toISOString(),
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast({
      title: 'Comment posted',
      description: 'Your comment has been added.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading font-semibold">Blog not found</h2>
          <p className="text-muted-foreground">The blog post you are looking for does not exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.username === blog.author.username;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
          
          {isAuthor && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/edit/${blog.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Cover Image */}
            {blog.cover_image_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={blog.cover_image_url} 
                  alt={blog.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {blog.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={blog.author.profile_photo_url} alt={blog.author.name} />
                  <AvatarFallback>
                    {blog.author.name?.split(' ').map(n => n[0]).join('') || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{blog.author.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? 'text-red-500 border-red-200' : ''}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlist}
                  className={isWishlisted ? 'text-amber-600 border-amber-200' : ''}
                >
                  <Bookmark className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  {paragraph.startsWith('#') ? (
                    <h2 className="text-2xl font-heading font-semibold mb-4 mt-8 first:mt-0">
                      {paragraph.replace(/^#+\s/, '')}
                    </h2>
                  ) : paragraph.startsWith('```') ? (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                      <code>{paragraph.replace(/```\w*\n?|\n?```/g, '')}</code>
                    </pre>
                  ) : (
                    <p className="text-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card id="comments">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={user.profile_photo_url} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Please log in to leave a comment
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 && <Separator />}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={comment.author.profile_photo_url} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name?.split(' ').map(n => n[0]).join('') || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {comments.length === 0 && user && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;