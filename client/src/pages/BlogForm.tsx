import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogsApi } from '@/api/blogs';
import { Blog, BlogFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // Load existing blog for editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchBlog = async () => {
        setIsLoading(true);
        try {
          const blog = await blogsApi.getBlog(parseInt(id));
          setFormData({
            title: blog.title,
            content: blog.content,
          });
        } catch (error: any) {
          toast({
            title: 'Error loading blog',
            description: 'Failed to load blog for editing',
            variant: 'destructive',
          });
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    }
  }, [isEditing, id, navigate]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      let blog: Blog;
      
      if (isEditing && id) {
        blog = await blogsApi.updateBlog(parseInt(id), formData);
        toast({
          title: 'Blog updated',
          description: 'Your blog post has been successfully updated.',
        });
      } else {
        blog = await blogsApi.createBlog(formData);
        toast({
          title: 'Blog created',
          description: 'Your blog post has been successfully published.',
        });
      }
      
      navigate(`/blog/${blog.id}`);
    } catch (error: any) {
      toast({
        title: isEditing ? 'Update failed' : 'Publish failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BlogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              
              <h1 className="text-xl font-heading font-semibold">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                onClick={handleSubmit}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEditing ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isPreview ? (
            /* Preview Mode */
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-heading">
                  {formData.title || 'Untitled Post'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content || '<p>No content yet...</p>' 
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter your blog title..."
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="text-lg"
                      disabled={isSaving}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-base font-medium">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your blog content here... You can use HTML tags for formatting."
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      className="min-h-[400px] resize-none"
                      disabled={isSaving}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">{errors.content}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      You can use HTML tags for formatting. For example: &lt;strong&gt;bold&lt;/strong&gt;, 
                      &lt;em&gt;italic&lt;/em&gt;, &lt;p&gt;paragraphs&lt;/p&gt;, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile publish button */}
              <div className="md:hidden">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {isEditing ? 'Updating...' : 'Publishing...'}
                    </>
                  ) : (
                    isEditing ? 'Update Blog Post' : 'Publish Blog Post'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogForm;