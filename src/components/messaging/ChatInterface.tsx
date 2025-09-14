import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Phone, Video, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
}

interface ChatInterfaceProps {
  receiverId: string;
  receiverName: string;
  appointmentId?: string;
  onStartVideoCall?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  receiverId,
  receiverName,
  appointmentId,
  onStartVideoCall
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name)
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        ...msg,
        sender_name: msg.sender?.full_name || 'Unknown'
      }));

      setMessages(formattedMessages);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user?.id)
        .eq('sender_id', receiverId);

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id}))`
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          
          // Get sender name
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newMsg.sender_id)
            .single();

          setMessages(prev => [...prev, {
            ...newMsg,
            sender_name: senderData?.full_name || 'Unknown'
          }]);

          // Mark as read if we're the receiver
          if (newMsg.receiver_id === user?.id) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage,
          appointment_id: appointmentId,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      
      // Send notification
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: receiverId,
          title: 'New Message',
          message: `${user.name} sent you a message`,
          type: 'message'
        }
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Chat with {receiverName}</span>
          <div className="flex space-x-2">
            {onStartVideoCall && (
              <Button
                variant="outline"
                size="sm"
                onClick={onStartVideoCall}
              >
                <Video className="w-4 h-4 mr-1" />
                Video Call
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Voice Call", description: "Voice calling coming soon!" })}
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-gray-800 border'
                  }`}
                >
                  {message.sender_id !== user?.id && (
                    <div className="text-xs font-medium mb-1 opacity-70">
                      {message.sender_name}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender_id === user?.id
                        ? 'text-primary-foreground opacity-70'
                        : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.created_at), 'HH:mm')}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "File Upload", description: "File sharing coming soon!" })}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;