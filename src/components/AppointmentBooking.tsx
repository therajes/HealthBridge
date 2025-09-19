import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Clock, 
  Star, 
  Circle,
  MessageSquare,
  Video,
  Calendar as CalendarIcon,
  ChevronRight,
  Stethoscope,
  MapPin,
  Languages
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMessaging } from '@/contexts/MessagingContext';
import { format } from 'date-fns';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  languages: string[];
  rating: number;
  isOnline: boolean;
  availability: string[];
  location: string;
  consultationFee: number;
}

interface AppointmentBookingProps {
  onClose: () => void;
  onMessage: (doctorId: string, doctorName: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  onClose, 
  onMessage 
}) => {
  const { toast } = useToast();
  const { createConversation } = useMessaging();
  
  const [step, setStep] = useState<'doctors' | 'datetime' | 'confirm'>('doctors');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');

  // Mock data for available doctors
  const availableDoctors: Doctor[] = [
    {
      id: 'doc-1',
      name: 'Dr. Rachit Kumar',
      specialization: 'General Physician',
      experience: '10 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.8,
      isOnline: true,
      availability: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 300
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Singh',
      specialization: 'Pediatrician',
      experience: '8 years',
      languages: ['English', 'Hindi'],
      rating: 4.7,
      isOnline: true,
      availability: ['9:00 AM', '10:30 AM', '1:00 PM', '5:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 350
    },
    {
      id: 'doc-3',
      name: 'Dr. Harpreet Kaur',
      specialization: 'Gynecologist',
      experience: '15 years',
      languages: ['English', 'Punjabi'],
      rating: 4.9,
      isOnline: false,
      availability: ['11:00 AM', '12:00 PM', '3:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 400
    },
    {
      id: 'doc-4',
      name: 'Dr. Amit Sharma',
      specialization: 'Cardiologist',
      experience: '12 years',
      languages: ['English', 'Hindi'],
      rating: 4.6,
      isOnline: true,
      availability: ['10:00 AM', '2:00 PM', '4:00 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 500
    },
    {
      id: 'doc-5',
      name: 'Dr. Simran Bajwa',
      specialization: 'Dermatologist',
      experience: '6 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.5,
      isOnline: true,
      availability: ['9:30 AM', '11:30 AM', '3:30 PM', '5:30 PM'],
      location: 'Nabha Civil Hospital',
      consultationFee: 350
    }
  ];

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('datetime');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Information",
        description: "Please select doctor, date, and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor.name} is confirmed for ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
    });

    onClose();
  };

  const handleMessageDoctor = (doctor: Doctor) => {
    // Create a conversation with the doctor
    createConversation(doctor.id);
    onMessage(doctor.id, doctor.name);
    
    toast({
      title: "Opening Chat",
      description: `Starting conversation with ${doctor.name}...`,
    });
  };

  return (
    <div className="space-y-4">
      {step === 'doctors' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Available Doctors</h3>
              <p className="text-sm text-muted-foreground">Choose a doctor for consultation</p>
            </div>
            <Badge variant="secondary" className="text-green-500">
              <Circle className="h-2 w-2 fill-current mr-1" />
              {availableDoctors.filter(d => d.isOnline).length} Online
            </Badge>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {availableDoctors.map(doctor => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    doctor.isOnline ? 'border-green-200' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {doctor.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{doctor.name}</h4>
                            {doctor.isOnline && (
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                Available Now
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Stethoscope className="h-3 w-3" />
                            <span>{doctor.specialization}</span>
                            <span>•</span>
                            <span>{doctor.experience}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{doctor.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{doctor.rating}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Languages className="h-3 w-3" />
                              <span>{doctor.languages.join(', ')}</span>
                            </div>
                            
                            <div className="font-semibold text-primary">
                              ₹{doctor.consultationFee}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="medical"
                              onClick={() => handleDoctorSelect(doctor)}
                            >
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Book Appointment
                            </Button>
                            
                            {doctor.isOnline && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleMessageDoctor(doctor)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            )}
                            
                            {doctor.isOnline && (
                              <Button 
                                size="sm" 
                                variant="success"
                                onClick={() => {
                                  toast({
                                    title: "Starting Video Call",
                                    description: `Connecting to ${doctor.name}...`,
                                  });
                                }}
                              >
                                <Video className="h-3 w-3 mr-1" />
                                Video Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {step === 'datetime' && selectedDoctor && (
        <>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setStep('doctors')}
              >
                ← Back
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}`} />
                  <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedDoctor.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDoctor.specialization}</p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>Select your preferred time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDoctor.availability.map(time => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'medical' : 'outline'}
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Describe Your Symptoms (Optional)</CardTitle>
                <CardDescription>Help the doctor prepare for your consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your symptoms or reason for consultation..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep('doctors')}>
                Back
              </Button>
              <Button 
                variant="medical" 
                onClick={() => setStep('confirm')}
                disabled={!selectedTime}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 'confirm' && selectedDoctor && selectedDate && selectedTime && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Appointment</CardTitle>
              <CardDescription>Review your appointment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Doctor</span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}`} />
                      <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedDoctor.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Specialization</span>
                  <span>{selectedDoctor.specialization}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Date</span>
                  <span>{format(selectedDate, 'PPP')}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Time</span>
                  <span>{selectedTime}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold text-primary">₹{selectedDoctor.consultationFee}</span>
                </div>
                
                {symptoms && (
                  <div className="py-2">
                    <span className="text-muted-foreground">Symptoms</span>
                    <p className="mt-1 text-sm">{symptoms}</p>
                  </div>
                )}
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation message and reminder before your appointment.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setStep('datetime')}>
                  Back
                </Button>
                <Button variant="medical" onClick={handleConfirmBooking}>
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};