import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, FileText, Video, CheckCircle, XCircle, Users, Activity, Stethoscope, Heart, TrendingUp, Zap, Sparkles, Award, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'consultations'>('overview');
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : mockAppointments;
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    notes: ''
  });

  const doctorAppointments = useMemo(() => appointments.filter((apt: any) => apt.doctorId === user?.id), [appointments, user?.id]);
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = doctorAppointments.filter(apt => apt.status === 'approved').length;
  const doctorMetrics = [
    { label: 'Today Consults', value: approvedCount, color: 'hsl(var(--primary))' },
    { label: 'Pending', value: pendingCount, color: 'hsl(var(--warning))' },
    { label: 'Messages (24h)', value: 32, color: 'hsl(var(--success))' }
  ];

  const handleApproveAppointment = (appointmentId: string) => {
    const updated = appointments.map((a: any) => a.id === appointmentId ? { ...a, status: 'approved' } : a);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    toast({
      title: "Appointment Approved",
      description: "Patient has been notified about the approved appointment.",
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    const updated = appointments.map((a: any) => a.id === appointmentId ? { ...a, status: 'rejected' } : a);
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    toast({
      title: "Appointment Rejected",
      description: "Patient has been notified. Please suggest alternative dates if possible.",
      variant: "destructive"
    });
  };

  const handleAddPrescription = () => {
    if (!prescriptionForm.medicines.trim()) {
      toast({
        title: "Error",
        description: "Please add medicines to the prescription.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Prescription Added",
      description: "Prescription has been saved and patient has been notified.",
    });

    setPrescriptionForm({ patientId: '', medicines: '', notes: '' });
  };

  const startVideoCall = (appointmentId: string) => {
    toast({
      title: "Video Call Started",
      description: "Connecting to patient... This is a demo simulation.",
    });
  };

  return (
    <div className="space-y-12">
      {/* Premium Doctor Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <motion.h1 
            className="text-5xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Doctor Dashboard
          </motion.h1>
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-secondary animate-pulse-premium" />
            <span className="text-muted-foreground">Premium Medical Practice</span>
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
                className="p-2 rounded-xl bg-gradient-secondary/10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Stethoscope className="h-6 w-6 text-gradient" />
              </motion.div>
              <div>
                <div className="text-sm text-muted-foreground">Welcome,</div>
                <div className="text-lg font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Dr. {user?.name}</div>
              </div>
              <Badge className="glass-premium border-premium text-accent">
                <Award className="h-3 w-3 mr-1" />
                Premium
              </Badge>
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-10">
          <TabsList className="glass-premium border-premium h-14 p-2">
            {[
              { value: 'overview', label: 'Overview', icon: Activity },
              { value: 'appointments', label: 'Appointments', icon: Calendar },
              { value: 'prescriptions', label: 'Prescriptions', icon: FileText },
              { value: 'consultations', label: 'Consultations', icon: Video }
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="glass-premium border-premium data-[state=active]:bg-gradient-secondary data-[state=active]:text-white flex items-center space-x-2 px-6 h-10"
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Premium Doctor Stats */}
          <motion.div 
            className="grid md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              {
                title: 'Pending Requests',
                value: pendingCount,
                subtitle: 'Awaiting approval',
                icon: Clock,
                color: 'text-warning',
                bgColor: 'bg-warning/10',
                gradient: 'from-warning/20 to-warning/5'
              },
              {
                title: "Today's Appointments",
                value: approvedCount,
                subtitle: 'Scheduled for today',
                icon: Calendar,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                gradient: 'from-primary/20 to-primary/5'
              },
              {
                title: 'Total Patients',
                value: '156',
                subtitle: 'This month',
                icon: Users,
                color: 'text-success',
                bgColor: 'bg-success/10',
                gradient: 'from-success/20 to-success/5'
              },
              {
                title: 'Consultations',
                value: '89',
                subtitle: 'Completed this week',
                icon: Video,
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                gradient: 'from-secondary/20 to-secondary/5'
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className="glass-card-premium border-premium">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 rounded-full mb-4">
                  <Zap className="h-4 w-4 text-secondary" />
                  <CardTitle className="text-xl font-bold text-foreground">Quick Actions</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Common tasks for premium medical practice
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6 px-8 pb-8">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={() => setActiveTab('appointments')} className="w-full h-24 btn-premium flex-col space-y-3 text-lg">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <CheckCircle className="h-8 w-8" />
                    </motion.div>
                    <span>Approve Appointments</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={() => setActiveTab('prescriptions')} variant="outline" className="w-full h-24 glass-premium border-premium hover:border-secondary/50 hover:bg-secondary/10 flex-col space-y-3 text-lg">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <FileText className="h-8 w-8 text-secondary" />
                    </motion.div>
                    <span>Write Prescription</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={() => setActiveTab('consultations')} variant="outline" className="w-full h-24 glass-premium border-premium hover:border-success/50 hover:bg-success/10 flex-col space-y-3 text-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    >
                      <Video className="h-8 w-8 text-success" />
                    </motion.div>
                    <span>Start Consultation</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

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
                    <Activity className="h-5 w-5 text-secondary" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground">Your Activity</CardTitle>
                </div>
                <Badge className="glass-premium border-premium text-secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Live Stats
                </Badge>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-6">
                  {doctorMetrics.map((metric, index) => (
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

        <TabsContent value="appointments" className="space-y-4">
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Appointment Requests</CardTitle>
              <CardDescription>Manage patient appointment requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-success" />
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                    <Badge variant={
                      appointment.status === 'pending' ? 'secondary' :
                      appointment.status === 'approved' ? 'default' : 'outline'
                    }>
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
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Symptoms:</strong> {appointment.symptoms}
                    </div>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleApproveAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectAppointment(appointment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {appointment.status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="medical"
                      onClick={() => startVideoCall(appointment.id)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Start Consultation
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Add Prescription</CardTitle>
              <CardDescription>Create prescription for your patients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient</label>
                <Input
                  placeholder="Enter patient name or ID"
                  value={prescriptionForm.patientId}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, patientId: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Medicines</label>
                <Textarea
                  placeholder="e.g., Paracetamol 500mg - Twice daily for 5 days"
                  value={prescriptionForm.medicines}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, medicines: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <Textarea
                  placeholder="Any additional instructions for the patient"
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button onClick={handleAddPrescription} variant="medical" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card className="glass-card-premium border-premium">
            <CardHeader>
              <CardTitle className="text-foreground">Video Consultations</CardTitle>
              <CardDescription>Manage your remote consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="font-medium">Available for Consultations</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Patients can book video calls with you
                  </p>
                  <Button variant="outline" size="sm">
                    Go Offline
                  </Button>
                </div>

                <div className="border border-border rounded-lg p-4 space-y-2">
                  <div className="text-lg font-semibold">Next Consultation</div>
                  <div className="text-sm text-muted-foreground">
                    Krishna - 10:00 AM Today
                  </div>
                  <Button variant="medical" size="sm">
                    <Video className="h-4 w-4 mr-1" />
                    Join Call
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Demo Video Call Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High-quality video and audio</li>
                  <li>• Screen sharing for medical reports</li>
                  <li>• Recording for medical records</li>
                  <li>• Secure, HIPAA-compliant platform</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;