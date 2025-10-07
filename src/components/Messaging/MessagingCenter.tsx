import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search,
  Users,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
  read: boolean;
}

interface Conversation {
  id: string;
  projectId: string;
  projectName: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

const MessagingCenter: React.FC = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      projectId: 'proj-1',
      projectName: 'Tropicana Heights Development',
      participants: [
        { id: '1', name: 'John Developer', role: 'Developer', avatar: '/placeholder.svg' },
        { id: '2', name: 'Sarah Chen', role: 'Consultant', avatar: '/placeholder.svg' },
        { id: '3', name: 'Mike Builder', role: 'Contractor', avatar: '/placeholder.svg' },
        { id: '4', name: 'Lisa Manager', role: 'Project Manager', avatar: '/placeholder.svg' }
      ],
      unreadCount: 2,
      lastMessage: {
        id: 'msg-1',
        senderId: '2',
        senderName: 'Sarah Chen',
        senderRole: 'Consultant',
        content: 'The revised architectural plans are ready for review. I\'ve uploaded them to the project documents.',
        timestamp: new Date('2024-03-20T14:30:00'),
        read: false
      },
      messages: [
        {
          id: 'msg-1',
          senderId: '2',
          senderName: 'Sarah Chen',
          senderRole: 'Consultant',
          content: 'The revised architectural plans are ready for review. I\'ve uploaded them to the project documents.',
          timestamp: new Date('2024-03-20T14:30:00'),
          attachments: ['revised_plans_v2.pdf'],
          read: false
        },
        {
          id: 'msg-2',
          senderId: '3',
          senderName: 'Mike Builder',
          senderRole: 'Contractor',
          content: 'Thanks Sarah. I\'ll review the plans and provide feedback by tomorrow. The foundation work is progressing well.',
          timestamp: new Date('2024-03-20T15:45:00'),
          read: false
        },
        {
          id: 'msg-3',
          senderId: '1',
          senderName: 'John Developer',
          senderRole: 'Developer',
          content: 'Great work everyone. Please keep me updated on any changes to the timeline.',
          timestamp: new Date('2024-03-20T16:00:00'),
          read: true
        }
      ]
    },
    {
      id: '2',
      projectId: 'proj-2',
      projectName: 'Metro Commercial Plaza',
      participants: [
        { id: '1', name: 'John Developer', role: 'Developer', avatar: '/placeholder.svg' },
        { id: '5', name: 'Ahmad Rahman', role: 'Consultant', avatar: '/placeholder.svg' }
      ],
      unreadCount: 0,
      lastMessage: {
        id: 'msg-4',
        senderId: '5',
        senderName: 'Ahmad Rahman',
        senderRole: 'Consultant',
        content: 'The structural calculations have been completed and submitted to the authorities.',
        timestamp: new Date('2024-03-19T11:20:00'),
        read: true
      },
      messages: [
        {
          id: 'msg-4',
          senderId: '5',
          senderName: 'Ahmad Rahman',
          senderRole: 'Consultant',
          content: 'The structural calculations have been completed and submitted to the authorities.',
          timestamp: new Date('2024-03-19T11:20:00'),
          read: true
        }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the project team.",
    });

    setNewMessage('');
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Messages
          </h1>
          <p className="text-muted-foreground">Communicate with your project team</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conversations
              {totalUnread > 0 && (
                <Badge variant="destructive">{totalUnread}</Badge>
              )}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{conversation.projectName}</h3>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {conversation.participants.length} participants
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    <span className="font-medium">{conversation.lastMessage.senderName}:</span>{' '}
                    {conversation.lastMessage.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                    {conversation.lastMessage.read ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              <CardHeader>
                <CardTitle>{selectedConv.projectName}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {selectedConv.participants.map(p => p.name).join(', ')}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {selectedConv.messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback>
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.senderRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <Paperclip className="h-3 w-3" />
                                  <span className="text-blue-600 hover:underline cursor-pointer">
                                    {attachment}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Message Input */}
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a project conversation to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagingCenter;