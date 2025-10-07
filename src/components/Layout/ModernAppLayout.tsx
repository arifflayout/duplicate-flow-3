import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut
} from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ModernAppLayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', icon: Home, id: 'dashboard', color: 'text-primary' },
  { name: 'Land Marketplace', icon: Building, id: 'land-marketplace', color: 'text-success' },
  { name: 'Projects', icon: FileText, id: 'projects', color: 'text-info' },
  { name: 'Consultants', icon: Users, id: 'consultants', color: 'text-warning' },
  { name: 'Contractors', icon: Building, id: 'contractors', color: 'text-secondary-500' },
  { name: 'Messages', icon: FileText, id: 'messages', color: 'text-accent-500' },
];

const ModernAppLayout: React.FC<ModernAppLayoutProps> = ({ 
  currentView, 
  onViewChange, 
  children 
}) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Modern Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <EnhancedButton
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </EnhancedButton>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-cool">DevPlatform</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, consultants, land..."
                className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <EnhancedButton variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </EnhancedButton>

            <div className="relative">
              <EnhancedButton
                variant="ghost"
                className="gap-2 h-auto p-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-white text-sm">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </EnhancedButton>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-lg shadow-xl border border-border/50 py-2">
                  <div className="px-4 py-2 border-b border-border/50">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-surface-50 transition-colors">
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-surface-50 transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <hr className="my-1 border-border/50" />
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-surface-50 transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Modern Sidebar */}
        <aside className={cn(
          "bg-card/50 backdrop-blur-sm border-r border-border/50 transition-all duration-300 z-40",
          "hidden md:block w-72",
          sidebarOpen && "block absolute left-0 top-0 w-72 h-full shadow-xl"
        )}>
          <div className="p-6">
            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-gradient-primary text-white shadow-lg" 
                        : "hover:bg-surface-100 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive 
                        ? "bg-white/20" 
                        : `bg-transparent group-hover:${item.color.replace('text-', 'bg-')}/10`
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : item.color
                      )} />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats Card */}
            <EnhancedCard variant="elevated" className="mt-6">
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <span className="font-semibold text-primary">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending Approvals</span>
                    <span className="font-semibold text-warning">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">New Messages</span>
                    <span className="font-semibold text-info">5</span>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernAppLayout;