import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark, Calendar } from 'lucide-react';
import { mockWishlistedBlogs } from '@/lib/mockData';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const handleRemoveFromWishlist = (blogId: string) => {
    // Mock function - would update database in real app
    console.log('Removing from wishlist:', blogId);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            Articles you've saved to read later
          </p>
        </div>

        {mockWishlistedBlogs.length > 0 ? (
          <div className="space-y-6">
            {mockWishlistedBlogs.map((blog) => (
              <Card key={blog.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Blog Image */}
                    {blog.cover_image_url && (
                      <div className="hidden md:block w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={blog.cover_image_url} 
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={blog.author.profile_photo_url} alt={blog.author.name} />
                          <AvatarFallback>
                            {blog.author.name?.split(' ').map(n => n[0]).join('') || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{blog.author.name}</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Title and Excerpt */}
                      <div>
                        <h2 className="text-xl font-heading font-semibold mb-2">
                          <Link 
                            to={`/blog/${blog.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {blog.title}
                          </Link>
                        </h2>
                        <p className="text-muted-foreground line-clamp-2">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <Heart className={`h-4 w-4 ${blog.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{blog.like_count}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{blog.comment_count}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(blog.id)}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                          <span className="sr-only">Remove from wishlist</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-semibold">Your wishlist is empty</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Start exploring articles and save the ones you want to read later by clicking the bookmark icon.
                  </p>
                </div>
                <Button asChild>
                  <Link to="/">Discover Articles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Wishlist;