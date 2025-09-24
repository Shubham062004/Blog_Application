import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <PenTool className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">BlogSpace</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your voice, your story. A simple platform to write, publish, and explore blogs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/create" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Write
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold">Account</h3>
            <div className="space-y-2">
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              BlogSpace is a community-driven platform where writers and readers connect through powerful storytelling.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 BlogSpace. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for writers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;