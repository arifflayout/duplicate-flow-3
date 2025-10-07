import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  FileText,
  DollarSign,
  Users,
  Calendar,
  X,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'milestone' | 'approval' | 'bid' | 'message' | 'payment' | 'deadline';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
  sender?: string;
  projectId?: string;
}

const NotificationCenter: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'milestone',
      title: 'Construction Milestone Completed',
      message: 'Ground floor structure has been completed ahead of schedule.',
      timestamp: new Date('2024-03-20T10:30:00'),
      read: false,
      priority: 'medium',
      actionUrl: '/project/1',
      actionLabel: 'View Progress',
      sender: 'Mike Builder',
      projectId: '1'
    },
    {
      id: '2',
      type: 'approval',
      title: 'Development Order Approved',
      message: 'Your development order application has been approved by the local planning authority.',
      timestamp: new Date('2024-03-19T14:15:00'),
      read: false,
      priority: 'high',
      actionUrl: '/approvals',
      actionLabel: 'View Approval',
      sender: 'Planning Authority'
    },
    {
      id: '3',
      type: 'bid',
      title: 'New Consultant Proposal',
      message: 'Sarah Chen has submitted a proposal for your Tropicana Heights project.',
      timestamp: new Date('2024-03-18T16:45:00'),
      read: true,
      priority: 'medium',
      actionUrl: '/consultants',
      actionLabel: 'Review Proposal',
      sender: 'Sarah Chen'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Due Reminder',
      message: 'Construction progress payment of RM 280,000 is due in 3 days.',
      timestamp: new Date('2024-03-17T09:00:00'),
      read: false,
      priority: 'high',
      actionUrl: '/financing',
      actionLabel: 'Make Payment',
      sender: 'System'
    },
    {
      id: '5',
      type: 'message',
      title: 'Message from Project Manager',
      message: 'Weekly progress report is ready for review. Please check the latest updates.',
      timestamp: new Date('2024-03-16T11:20:00'),
      read: true,
      priority: 'low',
      actionUrl: '/messages',
      actionLabel: 'Read Message',
      sender: 'Lisa Manager'
    },
    {
      id: '6',
      type: 'deadline',
      title: 'Approval Deadline Approaching',
      message: 'BOMBA approval submission deadline is in 5 days.',
      timestamp: new Date('2024-03-15T08:30:00'),
      read: false,
      priority: 'high',
      actionUrl: '/approvals',
      actionLabel: 'Submit Documents',
      sender: 'System'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'approval':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'bid':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'deadline':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const filterNotifications = (filter: string) => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'high-priority':
        return notifications.filter(n => n.priority === 'high');
      case 'today':
        const today = new Date();
        return notifications.filter(n => 
          n.timestamp.toDateString() === today.toDateString()
        );
      default:
        return notifications;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated on your project progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="high-priority">High Priority ({highPriorityCount})</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>

        {['all', 'unread', 'high-priority', 'today'].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-3">
            {filterNotifications(filter).length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === 'unread' ? "You're all caught up!" : "No notifications in this category."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterNotifications(filter).map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatTimestamp(notification.timestamp)}</span>
                            {notification.sender && (
                              <span>From: {notification.sender}</span>
                            )}
                            {notification.projectId && (
                              <span>Project: {notification.projectId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.actionLabel || 'View'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotificationCenter;