import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  Heart,
  Sparkles,
  MessageSquare,
  Clock,
  ChevronDown,
  Minimize2,
  Maximize2,
  Phone,
  Calendar,
  Pill,
  X
} from 'lucide-react';
import { getBotResponse, symptomCategories } from '@/data/medicalData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  urgency?: 'low' | 'medium' | 'high';
  suggestions?: string[];
}

interface MedicalChatbotProps {
  className?: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const MedicalChatbot: React.FC<MedicalChatbotProps> = ({ 
  className, 
  isMinimized = false,
  onMinimize,
  onMaximize 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm **Dr. MediCall AI**, your virtual health assistant. 👋\n\nI can help you with:\n• Understanding symptoms\n• Basic health guidance\n• Home remedies\n• When to see a doctor\n\nHow can I assist you today?",
      timestamp: new Date(),
      urgency: 'low'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const response = getBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.message,
        timestamp: new Date(),
        urgency: response.urgency,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Show toast for high urgency
      if (response.urgency === 'high') {
        toast({
          title: "⚠️ Urgent Medical Attention Needed",
          description: "Based on your symptoms, please seek immediate medical care.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    switch (suggestion) {
      case 'Book Emergency Appointment':
      case 'Book Regular Appointment':
        toast({
          title: "📅 Appointment Booking",
          description: "Redirecting to appointment booking...",
        });
        break;
      case 'Call Ambulance':
        toast({
          title: "🚨 Emergency Services",
          description: "Calling emergency services...",
          variant: "destructive"
        });
        break;
      case 'Find Nearby Pharmacy':
        toast({
          title: "💊 Pharmacy Locator",
          description: "Finding nearby pharmacies...",
        });
        break;
      case 'Talk to Doctor':
        toast({
          title: "👨‍⚕️ Connecting to Doctor",
          description: "Opening doctor consultation...",
        });
        break;
      default:
        toast({
          title: "Action",
          description: `Processing: ${suggestion}`,
        });
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet points
      if (line.startsWith('•')) {
        return <li key={index} className="ml-4" dangerouslySetInnerHTML={{ __html: line.substring(1).trim() }} />;
      }
      return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <Card className={cn(
      "shadow-xl border-0 bg-gradient-to-br from-blue-50 to-white overflow-hidden",
      isExpanded ? "fixed inset-4 z-50" : "relative",
      className
    )}>
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src="/doctor-ai.png" />
                <AvatarFallback className="bg-white text-blue-600">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Dr. MediCall AI
                <Badge className="bg-white/20 text-white border-white/30">Online</Badge>
              </CardTitle>
              <CardDescription className="text-blue-100 text-xs">
                AI Health Assistant • Available 24/7
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            {onMinimize && (
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={onMinimize}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col" style={{ height: isExpanded ? 'calc(100vh - 200px)' : '500px' }}>
        {/* Quick Actions */}
        <div className="p-3 border-b bg-gradient-to-r from-gray-50 to-white">
          <p className="text-xs text-gray-600 mb-2 font-medium">Quick Symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {symptomCategories.slice(0, 6).map((category) => (
              <Button
                key={category.label}
                size="sm"
                variant="outline"
                className="h-7 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                onClick={() => handleQuickAction(`I have ${category.keywords[0]}`)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex mb-4",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div className={cn(
                  "flex items-start space-x-2 max-w-[80%]",
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                )}>
                  <Avatar className="h-8 w-8 mt-1">
                    {message.role === 'bot' ? (
                      <>
                        <AvatarImage src="/doctor-ai.png" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="space-y-2">
                    <div className={cn(
                      "rounded-2xl px-4 py-3 shadow-sm",
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : message.urgency === 'high'
                        ? 'bg-red-50 border border-red-200'
                        : message.urgency === 'medium'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-100'
                    )}>
                      <div className={cn(
                        "text-sm",
                        message.role === 'user' ? 'text-white' : 'text-gray-800'
                      )}>
                        {message.role === 'bot' ? formatMessage(message.content) : message.content}
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.includes('Emergency') && <AlertCircle className="h-3 w-3 mr-1" />}
                            {suggestion.includes('Appointment') && <Calendar className="h-3 w-3 mr-1" />}
                            {suggestion.includes('Pharmacy') && <Pill className="h-3 w-3 mr-1" />}
                            {suggestion.includes('Doctor') && <Phone className="h-3 w-3 mr-1" />}
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-gray-500"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            <AlertCircle className="inline h-3 w-3 mr-1" />
            For emergencies, please call emergency services immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
};