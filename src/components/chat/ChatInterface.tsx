import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Image,
  FileText,
  ChevronLeft,
  Circle
} from 'lucide-react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  onBack?: () => void;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onBack, 
  onVideoCall, 
  onVoiceCall 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    activeConversation,
    messages,
    sendMessage,
    markAsRead,
    isTyping,
    setTyping,
    onlineUsers
  } = useMessaging();
  
  const [messageInput, setMessageInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only scroll to bottom when new messages are added
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only auto-scroll if the last message is from the current user or just received
      if (lastMessage.senderId === user?.id || 
          (new Date().getTime() - new Date(lastMessage.timestamp).getTime()) < 1000) {
        scrollToBottom();
      }
    }
    if (activeConversation) {
      markAsRead(activeConversation.id);
    }
  }, [messages.length, activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    sendMessage(messageInput, 'text');
    setMessageInput('');
    setTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast({
        title: "Voice Message Sent",
        description: "Your voice message has been recorded and sent.",
      });
      sendMessage("[Voice Message - 0:15]", 'voice', { duration: 15 });
    } else {
      // Start recording
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Speak now to record your message...",
      });
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Attached",
        description: `${file.name} has been sent.`,
      });
      sendMessage(`[File: ${file.name}]`, 'text', { fileName: file.name, fileSize: file.size });
    }
  };

  const handleSendTranscript = () => {
    const transcript = messages.map(msg => 
      `${msg.senderName}: ${msg.content}`
    ).join('\n');
    
    sendMessage("[Medical Transcript Shared]", 'transcript', { transcript });
    toast({
      title: "Transcript Sent",
      description: "The conversation transcript has been shared.",
    });
  };

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'HH:mm')}`;
    }
    return format(timestamp, 'dd/MM/yyyy HH:mm');
  };

  if (!activeConversation) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </CardContent>
      </Card>
    );
  }

  const otherParticipant = activeConversation.participants.find(p => p.id !== user?.id);
  const isOtherUserTyping = otherParticipant && isTyping[otherParticipant.id];

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      <CardHeader className="border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.name}`} />
              <AvatarFallback>{otherParticipant?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{otherParticipant?.name}</h3>
              <div className="flex items-center space-x-2">
                {otherParticipant?.isOnline ? (
                  <span className="flex items-center text-xs text-green-500">
                    <Circle className="h-2 w-2 fill-current mr-1" />
                    Online
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Last seen: {otherParticipant?.lastSeen ? format(otherParticipant.lastSeen, 'HH:mm') : 'Unknown'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onVoiceCall}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onVideoCall}>
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSendTranscript}>
              <FileText className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => {
            const isSender = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-1`}>
                  {!isSender && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {message.senderName}
                    </span>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isSender
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.type === 'voice' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Mic className="h-4 w-4" />
                        <span className="text-xs">Voice Message</span>
                      </div>
                    )}
                    {message.type === 'transcript' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">Medical Transcript</span>
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-muted-foreground ${isSender ? 'text-right' : 'text-left'} px-2`}>
                    {formatMessageTime(message.timestamp)}
                    {isSender && (
                      <span className="ml-2">
                        {message.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isOtherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <CardContent className="border-t p-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <Button variant="ghost" size="icon" onClick={handleFileAttachment}>
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Input
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleVoiceMessage}
            className={isRecording ? 'text-red-500 animate-pulse' : ''}
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            variant="medical"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};