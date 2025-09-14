import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Pill, Search, CheckCircle, AlertCircle, FileText, Mic, MessageSquare, Phone, Video, Activity, Heart, Stethoscope, TrendingUp, Zap, Sparkles, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers, mockAppointments, mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
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
    <div className="space-y-12">
      {/* Premium Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <motion.h1 
            className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Patient Dashboard
          </motion.h1>
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse-premium" />
            <span className="text-muted-foreground">Premium Healthcare Experience</span>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="glass-card-premium px-6 py-4 rounded-2xl border-premium">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-xl bg-gradient-primary/10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Heart className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <div className="text-sm text-muted-foreground">Welcome back,</div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user?.name}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Premium Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12"
      >
        <Tabs defaultValue="overview" className="space-y-10">
          <TabsList className="glass-premium border-premium h-14 p-2">
            {[
              { value: 'overview', label: 'Overview', icon: Activity },
              { value: 'symptoms', label: 'Symptom Checker', icon: Stethoscope },
              { value: 'appointments', label: 'Appointments', icon: Calendar },
              { value: 'medicines', label: 'Medicines', icon: Pill }
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="glass-premium border-premium data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center space-x-2 px-6 h-10"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Premium Stats Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              {
                title: 'Upcoming Appointments',
                value: patientAppointments.length,
                subtitle: 'Next: Today 10:00 AM',
                icon: Calendar,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                gradient: 'from-primary/20 to-primary/5'
              },
              {
                title: 'Active Prescriptions', 
                value: patientPrescriptions.length,
                subtitle: '2 medicines to take today',
                icon: Pill,
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                gradient: 'from-secondary/20 to-secondary/5'
              },
              {
                title: 'Health Score',
                value: 'Excellent',
                subtitle: 'Based on recent checkups',
                icon: Heart,
                color: 'text-success',
                bgColor: 'bg-success/10',
                gradient: 'from-success/20 to-success/5'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="glass-card-premium border-premium h-full overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                        </div>
                        <motion.div 
                          className={`p-3 rounded-xl ${stat.bgColor}`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <div className={`text-3xl font-black ${stat.color}`}>
                          {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Premium Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className="glass-card-premium border-premium">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 rounded-full mb-4">
                  <Zap className="h-4 w-4 text-accent" />
                  <CardTitle className="text-xl font-bold text-foreground">Quick Actions</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Access your most common healthcare tasks instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6 px-8 pb-8">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={openBooking} 
                    className="w-full h-24 btn-premium flex-col space-y-3 text-lg"
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Calendar className="h-8 w-8" />
                    </motion.div>
                    <span>Book Premium Consultation</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full h-24 glass-premium border-premium hover:border-accent/50 hover:bg-accent/10 flex-col space-y-3 text-lg"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <Search className="h-8 w-8 text-accent" />
                    </motion.div>
                    <span>Medicine Availability</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Health Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Card className="glass-card-premium border-premium">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="p-2 rounded-xl bg-gradient-secondary/10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground">Health Analytics</CardTitle>
                </div>
                <Badge className="glass-premium border-premium text-accent">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium Insights
                </Badge>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-6">
                  {patientMetrics.map((metric, index) => (
                    <motion.div 
                      key={metric.label}
                      className="text-center group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="glass-premium border-premium p-6 rounded-2xl">
                        <motion.div 
                          className="text-4xl font-black mb-2" 
                          style={{ color: metric.color }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        >
                          {metric.value}
                        </motion.div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {metric.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Symptom Checker</CardTitle>
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
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Your Appointments</CardTitle>
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
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Medicine Availability</CardTitle>
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

          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Your Prescriptions</CardTitle>
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
      </motion.div>

      {/* Custom Consultation Modal */}
      {isBookingOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBookingOpen(false)}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto glass-card-premium border-premium rounded-3xl p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full glass-premium border-premium hover:bg-destructive/10 transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </motion.button>

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 glass-premium px-6 py-3 rounded-full mb-6">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-primary">Premium Consultation Booking</span>
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                Book Your Appointment
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select your preferred doctor and consultation method for world-class healthcare
              </p>
            </motion.div>

            {/* Doctor Selection */}
            <motion.section 
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-secondary/10">
                  <Stethoscope className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Choose Your Doctor</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableDoctors.map((doc, index) => (
                  <motion.button
                    key={doc.id}
                    className={`group glass-premium border-premium p-6 rounded-2xl text-left transition-all duration-300 ${
                      selectedDoctorId === doc.id 
                        ? 'ring-2 ring-primary border-primary/50 bg-primary/10 shadow-lg shadow-primary/25' 
                        : 'hover:border-primary/40 hover:bg-primary/5 hover:shadow-md'
                    }`}
                    onClick={() => bookWithDoctor(doc.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-2xl bg-secondary/15 group-hover:bg-secondary/20 transition-colors">
                          <User className="h-7 w-7 text-secondary" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            Dr. {doc.name}
                          </div>
                          <div className="text-sm text-primary font-semibold">
                            {doc.specialization || 'General Medicine'}
                          </div>
                        </div>
                      </div>
                      {selectedDoctorId === doc.id && (
                        <motion.div 
                          className="text-primary"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{doc.location}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs text-success font-medium">Available Now</span>
                      </div>
                      <div className="text-xs text-muted-foreground">⭐ 4.9 (250+ reviews)</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Separator */}
            <motion.div 
              className="relative my-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <div className="glass-premium px-6 py-3 rounded-full">
                  <span className="text-sm font-medium text-muted-foreground">Tell us more about your concern</span>
                </div>
              </div>
            </motion.div>

            {/* Message Section */}
            <motion.section 
              className="mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-accent/10">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Describe Your Concern</h3>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">Optional</span>
              </div>
              <UITextarea
                placeholder="Share your symptoms, concerns, medical history, or specific questions you'd like to discuss with the doctor..."
                value={consultMessage}
                onChange={(e) => setConsultMessage(e.target.value)}
                rows={5}
                className="glass-premium border-premium resize-none text-base p-4 rounded-2xl"
              />
            </motion.section>

            {/* Consultation Methods */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-success/10">
                  <Video className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Choose Consultation Method</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { 
                    type: 'message', 
                    icon: MessageSquare, 
                    title: 'Text Chat', 
                    desc: 'Secure messaging', 
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/30',
                    features: ['Instant replies', 'File sharing', '24/7 access']
                  },
                  { 
                    type: 'voice', 
                    icon: Mic, 
                    title: 'Voice Messages', 
                    desc: 'Audio consultation', 
                    color: 'text-purple-500',
                    bgColor: 'bg-purple-500/10',
                    borderColor: 'border-purple-500/30',
                    disabled: !voiceNoteSupported,
                    features: ['Voice notes', 'Easy communication', 'Convenient']
                  },
                  { 
                    type: 'audio', 
                    icon: Phone, 
                    title: 'Audio Call', 
                    desc: 'Live phone consultation', 
                    color: 'text-success',
                    bgColor: 'bg-success/10',
                    borderColor: 'border-success/30',
                    features: ['Real-time talk', 'Clear audio', 'Personal touch']
                  },
                  { 
                    type: 'video', 
                    icon: Video, 
                    title: 'Video Call', 
                    desc: 'Face-to-face consultation', 
                    color: 'text-primary',
                    bgColor: 'bg-primary/10',
                    borderColor: 'border-primary/30',
                    features: ['HD video', 'Screen sharing', 'Best experience']
                  }
                ].map((method, index) => {
                  const Icon = method.icon;
                  const isDisabled = !selectedDoctorId || method.disabled;
                  return (
                    <motion.div
                      key={method.type}
                      className="group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.4 }}
                      whileHover={!isDisabled ? { y: -6, scale: 1.03 } : {}}
                      whileTap={!isDisabled ? { scale: 0.97 } : {}}
                    >
                      <Button 
                        disabled={isDisabled}
                        variant="outline"
                        onClick={() => createAppointment(method.type as any)}
                        className={`w-full h-auto glass-premium border-premium p-6 flex-col space-y-4 text-center transition-all duration-500 ${
                          isDisabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : `hover:${method.borderColor} hover:${method.bgColor} hover:shadow-xl group-hover:shadow-${method.color.split('-')[1]}-500/25`
                        }`}
                      >
                        <motion.div
                          className={`p-4 rounded-2xl ${method.bgColor} group-hover:scale-110 transition-transform`}
                          animate={!isDisabled ? { rotate: [0, 3, -3, 0] } : {}}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        >
                          <Icon className={`h-8 w-8 ${method.color}`} />
                        </motion.div>
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {method.title}
                          </div>
                          <div className="text-sm text-muted-foreground">{method.desc}</div>
                        </div>
                        {method.features && (
                          <div className="text-xs text-muted-foreground space-y-1">
                            {method.features.map((feature, i) => (
                              <div key={i} className="flex items-center justify-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-success" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              
              {!selectedDoctorId && (
                <motion.div 
                  className="text-center p-6 glass-premium border-premium rounded-2xl mt-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <AlertCircle className="h-8 w-8 text-warning mx-auto mb-3" />
                  <p className="text-base font-medium text-muted-foreground">
                    Please select a doctor first to choose your consultation method
                  </p>
                </motion.div>
              )}
            </motion.section>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDashboard;