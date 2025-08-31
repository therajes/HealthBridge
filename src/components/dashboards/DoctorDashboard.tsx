import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, FileText, Video, CheckCircle, XCircle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    notes: ''
  });

  const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === user?.id);
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedCount = doctorAppointments.filter(apt => apt.status === 'approved').length;

  const handleApproveAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Approved",
      description: "Patient has been notified about the approved appointment.",
    });
  };

  const handleRejectAppointment = (appointmentId: string) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
        <Badge variant="secondary" className="text-primary">
          Dr. {user?.name}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">156</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emergency">89</div>
                <p className="text-xs text-muted-foreground">Completed this week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for doctors</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button variant="medical" className="h-20 flex-col space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span>Approve Appointments</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Write Prescription</span>
              </Button>
              <Button variant="success" className="h-20 flex-col space-y-2">
                <Video className="h-6 w-6" />
                <span>Start Consultation</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
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
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Add Prescription</CardTitle>
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
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Video Consultations</CardTitle>
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
    </div>
  );
};

export default DoctorDashboard;