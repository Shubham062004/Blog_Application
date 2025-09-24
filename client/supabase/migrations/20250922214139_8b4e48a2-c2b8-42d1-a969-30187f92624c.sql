-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Update existing blogs table to use proper user references
ALTER TABLE public.blogs DROP COLUMN IF EXISTS author_id;
ALTER TABLE public.blogs ADD COLUMN author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add cover image to blogs
ALTER TABLE public.blogs ADD COLUMN cover_image_url TEXT;

-- Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blog_id)
);

-- Enable RLS on likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Anyone can view likes" 
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view comments" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blog_id)
);

-- Enable RLS on wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist
CREATE POLICY "Users can view their own wishlist" 
ON public.wishlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" 
ON public.wishlist 
FOR ALL 
USING (auth.uid() = user_id);

-- Update blogs policies to work with profiles
DROP POLICY IF EXISTS "Anyone can view blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can create blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can delete blogs" ON public.blogs;

CREATE POLICY "Anyone can view blogs" 
ON public.blogs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blogs" 
ON public.blogs 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blogs" 
ON public.blogs 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies
CREATE POLICY "Anyone can view images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

CREATE POLICY "Users can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();