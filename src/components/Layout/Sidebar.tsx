import React from 'react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ChevronRight,
  Briefcase,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();
  const { projects } = useProject();

  const navigationSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard, description: 'Project overview' }
      ]
    },
    {
      title: 'Project Setup',
      items: [
        { name: 'Land Marketplace', id: 'land-marketplace', icon: MapPin, description: 'Find development land' },
        { name: 'My Projects', id: 'projects', icon: FileText, description: 'Manage projects' }
      ]
    },
    {
      title: 'Team & Consultants',
      items: [
        { name: 'Consultant Appointment', id: 'consultants', icon: Users, description: 'Hire professionals', roles: ['developer'] },
        { name: 'My Bids', id: 'bids', icon: Hand, description: 'Track proposals', roles: ['consultant', 'contractor', 'cpm'] }
      ]
    },
    {
      title: 'Construction & Delivery',
      items: [
        { name: 'Contractors', id: 'contractors', icon: Hammer, description: 'Find contractors', roles: ['developer'] },
        { name: 'Design & Approval', id: 'design-approval', icon: FileCheck, description: 'Regulatory approvals', roles: ['developer', 'consultant'] },
        { name: 'Project Managers', id: 'cpm', icon: Construction, description: 'Hire project managers', roles: ['developer'] },
        { name: 'Construction', id: 'construction', icon: Briefcase, description: 'Monitor progress', roles: ['developer', 'consultant', 'contractor', 'cpm'] },
        { name: 'Compliance & Handover', id: 'compliance', icon: ClipboardCheck, description: 'Final compliance', roles: ['developer', 'consultant'] }
      ]
    },
    {
      title: 'Financial',
      items: [
        { name: 'Financing', id: 'financing', icon: DollarSign, description: 'Project funding', roles: ['developer'] }
      ]
    },
    {
      title: 'Communication',
      items: [
        { name: 'Messages', id: 'messages', icon: MessageSquare, description: 'Team communication' },
        { name: 'Notifications', id: 'notifications', icon: Bell, description: 'Updates & alerts' }
      ]
    }
  ];

  const getFilteredItems = (items: any[]) => {
    return items.filter(item => 
      !item.roles || item.roles.includes(user?.role || 'developer')
    );
  };

  const getUnreadCount = (itemId: string) => {
    // Mock unread counts - in real app, this would come from context/API
    const counts: Record<string, number> = {
      'messages': 3,
      'notifications': 5,
      'bids': 2,
      'projects': projects.length
    };
    return counts[itemId] || 0;
  };

  return (
    <div className="w-72 bg-card border-r border-border h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Project Hub</h3>
            <p className="text-xs text-muted-foreground capitalize">{user?.role} Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationSections.map((section) => {
          const filteredItems = getFilteredItems(section.items);
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                {section.title}
              </h4>
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const isActive = currentView === item.id;
                  const unreadCount = getUnreadCount(item.id);
                  
                  return (
                    <EnhancedButton
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-auto p-3 text-left",
                        isActive && "bg-primary text-primary-foreground shadow-sm",
                        !isActive && "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => onViewChange(item.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{item.name}</span>
                            {unreadCount > 0 && (
                              <Badge 
                                variant="destructive" 
                                className="h-5 w-5 p-0 text-xs flex items-center justify-center ml-2"
                              >
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className={cn(
                            "text-xs truncate",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}>
                            {item.description}
                          </p>
                        </div>
                        {!isActive && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </EnhancedButton>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {projects.length > 0 && (
            <div className="bg-gradient-to-r from-success/10 to-info/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Active Projects</span>
              </div>
              <div className="text-lg font-bold text-success">{projects.length}</div>
              <div className="text-xs text-success/80">Projects in progress</div>
            </div>
          )}
          
          <div className="bg-gradient-to-r from-primary/10 to-info/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
              <Building className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Need Help?</h4>
              <p className="text-xs text-muted-foreground">Contact support</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;