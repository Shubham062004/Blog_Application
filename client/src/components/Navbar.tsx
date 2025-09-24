import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, PenTool, User, LogOut, Bookmark } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      {isAuthenticated && (
        <Link
          to="/create"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            isActive('/create') 
              ? 'bg-primary text-primary-foreground' 
              : 'text-foreground hover:bg-secondary'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <PenTool className="h-4 w-4" />
          Write
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
              <PenTool className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">BlogSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <NavLinks />
            
            <div className="pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Signed in as {user?.username}
                  </div>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/wishlist">Wishlist</Link>
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;