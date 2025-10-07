import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard,
  MapPin, 
  Users, 
  FileText, 
  Building, 
  Hammer, 
  Construction,
  DollarSign,
  Hand,
  FileCheck,
  Bell,
  MessageSquare,
  ClipboardCheck,
  Menu,
  X,
  Plus,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const primaryActions = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Projects', id: 'projects', icon: FileText },
    { name: 'Messages', id: 'messages', icon: MessageSquare, badge: 3 },
    { name: 'More', id: 'more', icon: Menu }
  ];

  const quickActions = [
    { name: 'Find Land', id: 'land-marketplace', icon: MapPin, color: 'bg-blue-500' },
    { name: 'New Project', id: 'project-brief', icon: Plus, color: 'bg-green-500' },
    { name: 'Find Consultants', id: 'consultants', icon: Users, color: 'bg-purple-500' },
    { name: 'Search', id: 'search', icon: Search, color: 'bg-orange-500' }
  ];

  const allNavItems = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard, section: 'Overview' },
    { name: 'Land Marketplace', id: 'land-marketplace', icon: MapPin, section: 'Project Setup' },
    { name: 'My Projects', id: 'projects', icon: FileText, section: 'Project Setup' },
    { name: 'Consultants', id: 'consultants', icon: Users, section: 'Team', roles: ['developer'] },
    { name: 'Contractors', id: 'contractors', icon: Hammer, section: 'Construction', roles: ['developer'] },
    { name: 'Design & Approval', id: 'design-approval', icon: FileCheck, section: 'Construction' },
    { name: 'Project Managers', id: 'cpm', icon: Construction, section: 'Construction', roles: ['developer'] },
    { name: 'Construction', id: 'construction', icon: Building, section: 'Construction' },
    { name: 'Financing', id: 'financing', icon: DollarSign, section: 'Financial', roles: ['developer'] },
    { name: 'Compliance', id: 'compliance', icon: ClipboardCheck, section: 'Final' },
    { name: 'My Bids', id: 'bids', icon: Hand, section: 'Team', roles: ['consultant', 'contractor', 'cpm'] },
    { name: 'Messages', id: 'messages', icon: MessageSquare, section: 'Communication', badge: 3 },
    { name: 'Notifications', id: 'notifications', icon: Bell, section: 'Communication', badge: 5 }
  ];

  const filteredNavItems = allNavItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || 'developer')
  );

  const groupedNavItems = filteredNavItems.reduce((acc, item) => {
    const section = item.section || 'Other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, typeof filteredNavItems>);

  const handleNavigation = (viewId: string) => {
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="grid grid-cols-4 h-16">
          {primaryActions.map((action) => {
            const isActive = currentView === action.id || (action.id === 'more' && isOpen);
            
            if (action.id === 'more') {
              return (
                <Sheet key={action.id} open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <button className={cn(
                      "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}>
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Quick Actions */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {quickActions.map((action) => (
                            <EnhancedButton
                              key={action.id}
                              variant="outline"
                              className="h-16 flex-col gap-2"
                              onClick={() => handleNavigation(action.id)}
                            >
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.color)}>
                                <action.icon className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-xs">{action.name}</span>
                            </EnhancedButton>
                          ))}
                        </div>
                      </div>

                      {/* All Navigation Items */}
                      <div className="space-y-4">
                        {Object.entries(groupedNavItems).map(([section, items]) => (
                          <div key={section}>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{section}</h3>
                            <div className="space-y-1">
                              {items.map((item) => (
                                <EnhancedButton
                                  key={item.id}
                                  variant={currentView === item.id ? "default" : "ghost"}
                                  className="w-full justify-start gap-3"
                                  onClick={() => handleNavigation(item.id)}
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span className="flex-1 text-left">{item.name}</span>
                                  {item.badge && (
                                    <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </EnhancedButton>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            }

            return (
              <button
                key={action.id}
                onClick={() => handleNavigation(action.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 transition-colors relative",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.name}</span>
                {action.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-destructive">
                    {action.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileNavigation;