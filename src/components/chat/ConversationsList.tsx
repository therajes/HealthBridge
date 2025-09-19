import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageSquarePlus, Circle } from 'lucide-react';
import { useMessaging, Conversation } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';

interface ConversationsListProps {
  onSelectConversation?: (conversation: Conversation) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ 
  onSelectConversation 
}) => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    onlineUsers
  } = useMessaging();
  
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    onSelectConversation?.(conversation);
  };

  const formatLastMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    }
    return format(timestamp, 'dd/MM/yy');
  };

  const truncateMessage = (message: string, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const otherParticipant = conv.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Messages</CardTitle>
          <Button size="icon" variant="ghost">
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full overflow-y-auto">
          <div className="space-y-1 p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                const isActive = activeConversation?.id === conversation.id;
                const isOnline = otherParticipant && onlineUsers.has(otherParticipant.id);
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full text-left rounded-lg p-3 transition-colors hover:bg-muted/50 ${
                      isActive ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.name}`} 
                          />
                          <AvatarFallback>
                            {otherParticipant?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">
                            {otherParticipant?.name}
                          </p>
                          {conversation.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatLastMessageTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage ? (
                              <>
                                {conversation.lastMessage.senderId === user?.id && (
                                  <span className="mr-1">You:</span>
                                )}
                                {truncateMessage(conversation.lastMessage.content)}
                              </>
                            ) : (
                              'No messages yet'
                            )}
                          </p>
                          
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2 h-5 min-w-[20px] px-1">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {otherParticipant && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {otherParticipant.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};