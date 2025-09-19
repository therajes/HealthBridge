import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, MessageSquare, Phone, Clock, Calendar, User, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConversationsList } from '@/components/chat/ConversationsList';
import { VideoCall } from '@/components/VideoCall';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Consultations = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sharma',
      specialty: 'Cardiologist',
      rating: 4.8,
      consultations: 1250,
      availability: 'Available Now',
      price: '₹500',
      image: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Dr. Patel',
      specialty: 'Pediatrician',
      rating: 4.9,
      consultations: 980,
      availability: 'Available in 30 min',
      price: '₹400',
      image: '/api/placeholder/100/100'
    },
    {
      id: '3',
      name: 'Dr. Singh',
      specialty: 'General Physician',
      rating: 4.7,
      consultations: 2100,
      availability: 'Available Now',
      price: '₹300',
      image: '/api/placeholder/100/100'
    }
  ];

  const handleStartConsultation = (doctor: any, type: 'video' | 'chat' | 'voice') => {
    setSelectedDoctor(doctor);
    if (type === 'video') {
      setShowVideoCall(true);
    } else if (type === 'voice') {
      toast({
        title: "Voice Call Started",
        description: `Connecting to ${doctor.name}...`,
      });
    } else {
      toast({
        title: "Chat Started",
        description: `You can now message ${doctor.name}`,
      });
    }
  };

  return (
    <Layout>
      <div className="px-4 md:px-6 lg:px-8 space-y-8">
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            {t('nav.consultations')}
          </h1>
          <p className="text-xl text-gray-600">
            Connect with healthcare professionals instantly
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctors List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Doctors</CardTitle>
                <CardDescription>Choose a doctor for consultation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {doctor.name.split(' ')[1][0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="ml-1 text-sm">{doctor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {doctor.consultations} consultations
                            </span>
                          </div>
                          <Badge className="mt-2" variant={doctor.availability === 'Available Now' ? 'success' : 'secondary'}>
                            {doctor.availability}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{doctor.price}</p>
                        <p className="text-xs text-gray-500">per consultation</p>
                        <div className="flex flex-col space-y-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="medical"
                            onClick={() => handleStartConsultation(doctor, 'video')}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Video
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStartConsultation(doctor, 'chat')}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <div className="space-y-4">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Your conversations with doctors</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ConversationsList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <p>Have your symptoms list ready</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <p>Keep your medical history handy</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <p>Ensure good internet connection</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <p>Find a quiet, well-lit space</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Call Dialog */}
      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          {selectedDoctor && (
            <VideoCall
              participantName={selectedDoctor.name}
              participantRole="doctor"
              onEndCall={() => setShowVideoCall(false)}
              onToggleChat={() => {
                setShowVideoCall(false);
                toast({
                  title: "Switched to Chat",
                  description: "Continue your consultation via chat",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Consultations;