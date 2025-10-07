import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { navigateToView } from '@/utils/navigationHelpers';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Building2, Bell, User, Settings, LogOut, Search, Menu, Plus } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { withErrorHandling } = useErrorHandler();

  const handleLogout = withErrorHandling(() => {
    logout();
    navigate('/login');
  }, 'logout');

  const handleNewProject = withErrorHandling(() => {
    navigateToView('land-marketplace');
  }, 'new project navigation');

  const handleNotifications = withErrorHandling(() => {
    navigateToView('notifications');
  }, 'notifications navigation');

  if (!user) {
    return (
      <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 glass-effect">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">PropDev</h1>
                <p className="text-xs text-muted-foreground">Development Platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EnhancedButton variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </EnhancedButton>
            <EnhancedButton variant="gradient" onClick={() => navigate('/signup')}>
              Get Started
            </EnhancedButton>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 glass-effect">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">PropDev</h1>
              <p className="text-xs text-muted-foreground">Development Platform</p>
            </div>
          </div>
          
          {/* Global Search - Hidden on mobile */}
          <div className="hidden lg:block w-96">
            <EnhancedInput
              variant="search"
              placeholder="Search projects, consultants, land..."
              icon={<Search className="h-4 w-4" />}
              className="bg-surface-50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <EnhancedButton 
              variant="outline" 
              size="sm" 
              onClick={handleNewProject}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Project
            </EnhancedButton>
          </div>

          {/* Mobile Menu Button */}
          <EnhancedButton 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </EnhancedButton>

          {/* Notifications */}
          <EnhancedButton 
            variant="ghost" 
            size="icon" 
            onClick={handleNotifications}
            className="relative hidden md:flex"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center p-0 min-w-[20px]">
              3
            </Badge>
          </EnhancedButton>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EnhancedButton variant="ghost" className="relative h-12 w-12 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-info text-white font-semibold">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </EnhancedButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {user?.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;