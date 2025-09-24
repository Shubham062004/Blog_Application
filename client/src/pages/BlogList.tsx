import React, { useState, useEffect } from 'react';
import { BlogListResponse } from '@/types';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { PenTool } from 'lucide-react';
import { mockBlogs } from '@/lib/mockData';

const BlogList: React.FC = () => {
  const [blogData, setBlogData] = useState<BlogListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const fetchBlogs = async (page: number) => {
    setIsLoading(true);
    try {
      // Mock API call with pagination
      setTimeout(() => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedBlogs = mockBlogs.slice(startIndex, endIndex);
        
        const data: BlogListResponse = {
          count: mockBlogs.length,
          next: endIndex < mockBlogs.length ? `page=${page + 1}` : null,
          previous: startIndex > 0 ? `page=${page - 1}` : null,
          results: paginatedBlogs,
        };
        
        setBlogData(data);
        setIsLoading(false);
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Error loading blogs',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              <span className="gradient-text">Your Voice,</span> Your Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A simple platform to write, publish, and explore blogs. Create freely, connect with readers, and let your voice be heard anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {blogData && blogData.results.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogData.results.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {blogData.count > pageSize && (
                <div className="flex justify-center pt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalCount={blogData.count}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    hasNext={!!blogData.next}
                    hasPrevious={!!blogData.previous}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                    <PenTool className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-semibold">No posts yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your thoughts with the community.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state for pagination */}
          {isLoading && blogData && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogList;