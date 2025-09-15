import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Pill, Search, CheckCircle, AlertCircle, FileText, Mic, MessageSquare, Phone, Video, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers, mockAppointments, mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea as UITextarea } from '@/components/ui/textarea';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicineSearch, setMedicineSearch] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [consultMessage, setConsultMessage] = useState('');
  const [voiceNoteSupported] = useState<boolean>(true);
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    headache: false,
    bodyPain: false,
    nausea: false,
    fatigue: false,
    other: ''
  });

  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : mockAppointments;
  });
  const patientAppointments = appointments.filter((apt: any) => apt.patientId === user?.id);
  const availableDoctors = useMemo(() => demoUsers.filter(u => u.role === 'doctor'), []);
  const patientMetrics = useMemo(() => ([
    { label: 'Consults (30d)', value: 6, color: 'hsl(var(--primary))' },
    { label: 'Messages', value: 24, color: 'hsl(var(--success))' },
    { label: 'Avg. Wait (min)', value: 12, color: 'hsl(var(--warning))' }
  ]), []);
  const patientPrescriptions = mockPrescriptions.filter(presc => presc.patientId === user?.id);

  const handleSymptomCheck = () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([key, value]) => key !== 'other' && value)
      .map(([key]) => key);
    
    if (selectedSymptoms.length > 0 || symptoms.other) {
      toast({
        title: "Symptoms Recorded",
        description: "Based on your symptoms, we recommend consulting a doctor. Would you like to book an appointment?",
      });
    }
  };

  const searchMedicine = () => {
    if (!medicineSearch.trim()) return;
    
    const medicine = mockMedicineStock.find(med => 
      med.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    if (medicine) {
      toast({
        title: medicine.stock > 0 ? "Medicine Available!" : "Out of Stock",
        description: medicine.stock > 0 
          ? `${medicine.name} is available. Stock: ${medicine.stock} units, Price: ₹${medicine.price}`
          : `${medicine.name} is currently out of stock. We'll notify you when available.`,
        variant: medicine.stock > 0 ? "default" : "destructive"
      });
    } else {
      toast({
        title: "Medicine Not Found",
        description: "The requested medicine is not available in our database.",
        variant: "destructive"
      });
    }
  };

  const openBooking = () => {
    setIsBookingOpen(true);
  };

  const bookWithDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
  };

  const createAppointment = (mode: 'message' | 'voice' | 'audio' | 'video') => {
    if (!user || !selectedDoctorId) return;
    const doctor = availableDoctors.find(d => d.id === selectedDoctorId);
    const newAppointment = {
      id: `apt_${Date.now()}`,
      patientId: user.id,
      patientName: user.name,
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      specialty: doctor?.specialization || 'General Medicine',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: mode === 'message' || mode === 'voice' ? 'approved' : 'pending',
      symptoms: consultMessage || '—',
      mode,
    } as any;
    const next = [newAppointment, ...appointments];
    setAppointments(next);
    localStorage.setItem('appointments', JSON.stringify(next));
    setIsBookingOpen(false);
    setSelectedDoctorId(null);
    setConsultMessage('');
    toast({
      title: 'Appointment Created',
      description: mode === 'message' || mode === 'voice' ? 'Asynchronous consultation started.' : 'Doctor will confirm your live session shortly.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
        <Badge variant="secondary" className="text-success">
          Welcome, {user?.name}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-card transition-transform duration-200 hover:scale-[1.01]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{patientAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Next: Today 10:00 AM</p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-transform duration-200 hover:scale-[1.01]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{patientPrescriptions.length}</div>
                <p className="text-xs text-muted-foreground">2 medicines to take today</p>
              </CardContent>
            </Card>

            <Card className="shadow-card transition-transform duration-200 hover:scale-[1.01]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">Good</div>
                <p className="text-xs text-muted-foreground">Based on recent checkups</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card animate-slide-up">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for patients</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Button onClick={openBooking} variant="medical" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Search className="h-6 w-6" />
                <span>Check Medicine</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Health Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {patientMetrics.map((m) => (
                  <div key={m.label} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
              <CardDescription>Select your symptoms to get initial guidance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(symptoms).filter(([key]) => key !== 'other').map(([symptom, checked]) => (
                  <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked as boolean}
                      onChange={(e) => setSymptoms(prev => ({ ...prev, [symptom]: e.target.checked }))}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="capitalize">{symptom.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Other symptoms:</label>
                <Textarea
                  placeholder="Describe any other symptoms..."
                  value={symptoms.other}
                  onChange={(e) => setSymptoms(prev => ({ ...prev, other: e.target.value }))}
                />
              </div>

              <Button onClick={handleSymptomCheck} variant="medical" className="w-full">
                Check Symptoms
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>Manage your doctor consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{appointment.doctorName}</span>
                    </div>
                    <Badge variant={appointment.status === 'approved' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  {appointment.symptoms && (
                    <p className="text-sm text-muted-foreground">Symptoms: {appointment.symptoms}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Medicine Availability</CardTitle>
              <CardDescription>Check if medicines are available at nearby pharmacies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search medicine name..."
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchMedicine} variant="medical">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Prescriptions</CardTitle>
              <CardDescription>Active prescriptions from doctors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientPrescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{prescription.doctorName}</span>
                    </div>
                    <Badge variant="secondary">{prescription.date}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center space-x-2 text-sm">
                        <Pill className="h-3 w-3 text-success" />
                        <span className="font-medium">{medicine.name}</span>
                        <span className="text-muted-foreground">
                          {medicine.dosage} - {medicine.frequency} for {medicine.duration}
                        </span>
                      </div>
                    ))}
                  </div>

                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      Notes: {prescription.notes}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>Select a doctor and how you'd like to consult</DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-3">
            {availableDoctors.map((doc) => (
              <button
                key={doc.id}
                className={`border rounded-lg p-3 text-left hover:bg-muted ${selectedDoctorId === doc.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => bookWithDoctor(doc.id)}
              >
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">{doc.specialization || 'General Medicine'}</div>
                <div className="text-xs text-muted-foreground">{doc.location}</div>
              </button>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Describe your concern (optional)</label>
            <UITextarea
              placeholder="Short message about your symptoms..."
              value={consultMessage}
              onChange={(e) => setConsultMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-2">
            <Button disabled={!selectedDoctorId} variant="outline" onClick={() => createAppointment('message')}>
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
            <Button disabled={!selectedDoctorId || !voiceNoteSupported} variant="outline" onClick={() => createAppointment('voice')}>
              <Mic className="h-4 w-4 mr-1" /> Voice Note
            </Button>
            <Button disabled={!selectedDoctorId} variant="success" onClick={() => createAppointment('audio')}>
              <Phone className="h-4 w-4 mr-1" /> Audio Call
            </Button>
            <Button disabled={!selectedDoctorId} variant="medical" onClick={() => createAppointment('video')}>
              <Video className="h-4 w-4 mr-1" /> Video Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;