import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Edit3, Mail, Camera, Plus, Trash2, Edit } from 'lucide-react';
import { mockUser, mockUserBlogs } from '@/lib/mockData';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name || '',
    email: mockUser.email || '',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const handleDeleteBlog = (blogId: string) => {
    toast({
      title: 'Blog deleted',
      description: 'Your blog post has been deleted.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader className="text-center pb-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={mockUser.profile_photo_url} alt={mockUser.name} />
                <AvatarFallback className="text-2xl">
                  {mockUser.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>@{mockUser.username}</span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockUser.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Blogs Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                My Blog Posts
                <Badge variant="secondary">{mockUserBlogs.length}</Badge>
              </CardTitle>
              <Button asChild>
                <Link to="/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {mockUserBlogs.length > 0 ? (
              <div className="space-y-4">
                {mockUserBlogs.map((blog, index) => (
                  <div key={blog.id}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          <Link to={`/blog/${blog.id}`} className="hover:text-primary transition-colors">
                            {blog.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                          <span>{blog.like_count} likes</span>
                          <span>{blog.comment_count} comments</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/edit/${blog.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < mockUserBlogs.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                    <Edit3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">No blog posts yet</h3>
                    <p className="text-muted-foreground">
                      Start sharing your thoughts with the world!
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/create">Write Your First Post</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;