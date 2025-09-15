import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Pill, Search, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments, mockPrescriptions, mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicineSearch, setMedicineSearch] = useState('');
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    headache: false,
    bodyPain: false,
    nausea: false,
    fatigue: false,
    other: ''
  });

  const patientAppointments = mockAppointments.filter(apt => apt.patientId === user?.id);
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

  return (
    <div className="space-y-6">
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
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{patientAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Next: Today 10:00 AM</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{patientPrescriptions.length}</div>
                <p className="text-xs text-muted-foreground">2 medicines to take today</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
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

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for patients</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Button variant="medical" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Search className="h-6 w-6" />
                <span>Check Medicine</span>
              </Button>
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
    </div>
  );
};

export default PatientDashboard;