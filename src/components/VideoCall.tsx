import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor } from 'lucide-react';
import Webcam from 'react-webcam';

interface VideoCallProps {
  appointmentId: string;
  isDoctor: boolean;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ appointmentId, isDoctor, onEndCall }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const webcamRef = useRef<Webcam>(null);
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [roomUrl, setRoomUrl] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startCall = async () => {
    try {
      // Generate video room token using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('video-call-token', {
        body: {
          appointmentId,
          userId: user?.id,
          userRole: user?.role
        }
      });

      if (error) throw error;

      setRoomUrl(data.videoUrl);
      setIsCallActive(true);
      
      toast({
        title: "Call Started",
        description: "Video call has been initiated successfully.",
      });

      // Update appointment status
      await supabase
        .from('appointments')
        .update({ 
          video_room_id: data.roomId,
          status: 'approved' 
        })
        .eq('id', appointmentId);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start video call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endCall = async () => {
    setIsCallActive(false);
    setCallDuration(0);
    
    // Update appointment status to completed
    await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', appointmentId);

    toast({
      title: "Call Ended",
      description: `Call duration: ${formatDuration(callDuration)}`,
    });

    onEndCall();
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // In a real implementation, you would use getDisplayMedia API
        setIsScreenSharing(true);
        toast({
          title: "Screen Sharing",
          description: "Screen sharing started",
        });
      } else {
        setIsScreenSharing(false);
        toast({
          title: "Screen Sharing",
          description: "Screen sharing stopped",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle screen sharing",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const joinExternalRoom = () => {
    if (roomUrl) {
      window.open(roomUrl, '_blank', 'width=1200,height=800');
    }
  };

  if (!isCallActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Video Consultation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {isDoctor ? 'Click start to begin the consultation' : 'Waiting for doctor to start the call'}
              </p>
            </div>
            
            {isDoctor && (
              <Button onClick={startCall} className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Video Consultation - {formatDuration(callDuration)}</span>
          <Button variant="outline" onClick={joinExternalRoom}>
            Open in New Window
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Local Video */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {videoEnabled ? (
              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover"
                mirrored={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <VideoOff className="w-8 h-8" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>

          {/* Remote Video Placeholder */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <div className="flex items-center justify-center h-full text-white">
              <Video className="w-8 h-8" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {isDoctor ? 'Patient' : 'Doctor'}
            </div>
            <div className="absolute top-2 right-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={joinExternalRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Join Full Video Call
              </Button>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={audioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={videoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? "secondary" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> For the full video calling experience, click "Join Full Video Call" above or 
            "Open in New Window" to use our integrated Jitsi Meet room. This demo shows the basic interface.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCall;