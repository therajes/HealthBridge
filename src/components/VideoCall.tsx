import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Maximize,
  Monitor,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallProps {
  participantName: string;
  participantRole: string;
  onEndCall: () => void;
  onToggleChat?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  participantName,
  participantRole,
  onEndCall,
  onToggleChat
}) => {
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting'>('connecting');
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate connection establishment
    setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Connected",
        description: `You are now connected with ${participantName}`,
      });
    }, 2000);

    // Start call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate getting user media (for demo)
    if (videoRef.current) {
      // In a real app, you would use navigator.mediaDevices.getUserMedia
      // For demo, we'll just show a placeholder
      videoRef.current.style.background = '#1a1a1a';
    }

    return () => {
      clearInterval(timer);
    };
  }, [participantName]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: isVideoOn ? "Your camera has been turned off" : "Your camera is now on",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "Your microphone is now on" : "You are now muted",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Sharing Stopped" : "Screen Sharing Started",
      description: isScreenSharing 
        ? "You have stopped sharing your screen" 
        : "You are now sharing your screen",
    });
  };

  const handleEndCall = () => {
    toast({
      title: "Call Ended",
      description: `Your call with ${participantName} has ended`,
    });
    onEndCall();
  };

  return (
    <Card className="h-full bg-gray-900 text-white">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Status Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
              className="bg-opacity-80"
            >
              {connectionStatus === 'connecting' && "Connecting..."}
              {connectionStatus === 'connected' && `Connected • ${formatDuration(callDuration)}`}
              {connectionStatus === 'reconnecting' && "Reconnecting..."}
            </Badge>
            <Badge variant="outline" className="bg-opacity-80 text-white border-white">
              <Volume2 className="h-3 w-3 mr-1" />
              HD Quality
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => {}}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => {}}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 relative">
          {/* Remote Video (Main) */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            {/* Placeholder for demo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <span className="text-4xl font-semibold">
                  {participantName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{participantName}</h3>
              <p className="text-sm text-gray-400">{participantRole}</p>
              {!isVideoOn && (
                <Badge variant="secondary" className="mt-2">
                  Camera is off
                </Badge>
              )}
            </div>
          </div>

          {/* Local Video (PiP) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {/* Placeholder for demo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-gray-400">Your Video</div>
            </div>
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-gray-800">
          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "secondary"}
              className="rounded-full"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant={isVideoOn ? "secondary" : "destructive"}
              className="rounded-full"
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="rounded-full px-8"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5 mr-2" />
              End Call
            </Button>

            <Button
              size="lg"
              variant={isScreenSharing ? "default" : "secondary"}
              className="rounded-full"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-5 w-5" />
            </Button>

            {onToggleChat && (
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
                onClick={onToggleChat}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};