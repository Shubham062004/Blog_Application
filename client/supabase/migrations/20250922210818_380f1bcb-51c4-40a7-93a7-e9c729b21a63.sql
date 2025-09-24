-- Create table for users
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view all users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert themselves" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Create blogs table
CREATE TABLE public.blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    excerpt text,
    author_id uuid REFERENCES public.users(id) NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Enable Row Level Security for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Anyone can view blogs" 
ON public.blogs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own blogs" 
ON public.blogs 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own blogs" 
ON public.blogs 
FOR DELETE 
USING (true);

-- Insert sample user
INSERT INTO public.users (username, email, password)
VALUES ('example', 'example@gmail.com', 'example@123');

-- Insert sample blogs
INSERT INTO public.blogs (title, content, excerpt, author_id)
SELECT 
    title,
    content,
    excerpt,
    (SELECT id FROM public.users WHERE username = 'example')
FROM (VALUES
    ('Getting Started with React', 'React is a powerful library for building user interfaces. In this comprehensive guide, we''ll explore the fundamentals of React development...', 'React is a powerful library for building user interfaces. In this comprehensive guide, we''ll explore the fundamentals of React development...'),
    ('The Future of Web Development', 'Web development is constantly evolving. From static websites to dynamic applications, the landscape continues to change with new technologies...', 'Web development is constantly evolving. From static websites to dynamic applications, the landscape continues to change...'),
    ('Building Scalable Applications', 'Scalability is crucial for modern applications. Learn how to design and build applications that can grow with your user base...', 'Scalability is crucial for modern applications. Learn how to design and build applications that can grow with your user base...'),
    ('Understanding TypeScript', 'TypeScript brings type safety to JavaScript. Discover how TypeScript can help you write more maintainable and bug-free code...', 'TypeScript brings type safety to JavaScript. Discover how TypeScript can help you write more maintainable and bug-free code...'),
    ('Modern CSS Techniques', 'CSS has evolved significantly over the years. Explore modern CSS features like Grid, Flexbox, and custom properties...', 'CSS has evolved significantly over the years. Explore modern CSS features like Grid, Flexbox, and custom properties...'),
    ('Database Design Best Practices', 'Good database design is the foundation of any successful application. Learn the principles of effective database architecture...', 'Good database design is the foundation of any successful application. Learn the principles of effective database architecture...'),
    ('API Development with Node.js', 'Building robust APIs is essential for modern web applications. Learn how to create efficient and secure APIs using Node.js...', 'Building robust APIs is essential for modern web applications. Learn how to create efficient and secure APIs using Node.js...'),
    ('Frontend Performance Optimization', 'Performance is crucial for user experience. Discover techniques to optimize your frontend applications for speed and efficiency...', 'Performance is crucial for user experience. Discover techniques to optimize your frontend applications for speed and efficiency...'),
    ('Testing Strategies for React', 'Testing ensures code quality and reliability. Learn effective testing strategies for React applications using modern tools...', 'Testing ensures code quality and reliability. Learn effective testing strategies for React applications using modern tools...')
) AS sample_blogs(title, content, excerpt);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on blogs
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();