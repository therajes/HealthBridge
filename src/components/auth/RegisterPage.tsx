import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/types/auth';
import { verificationService } from '@/lib/verificationService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegisterPage = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form states for different user types
  const [patientForm, setPatientForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact: ''
  });

  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    specialization: '',
    license_number: '',
    experience_years: '',
    consultation_fee: ''
  });

  const [pharmacyForm, setPharmacyForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    pharmacy_name: '',
    license_id: '',
    location: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [requiredDocs, setRequiredDocs] = useState<{ type: string; label: string }[]>([]);

  useEffect(() => {
    const getRequiredDocs = async (role: UserRole) => {
      const docs = await verificationService.getRequiredDocuments(role);
      setRequiredDocs(docs);
    };

    // Clear required docs when tab changes
    setRequiredDocs([]);
    
    const currentTab = document.querySelector('[data-state="active"]')?.getAttribute('value') as UserRole;
    if (currentTab && currentTab !== 'patient') {
      getRequiredDocs(currentTab);
    }
  }, []);

  const handleFileChange = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({
        ...prev,
        [type]: e.target.files![0]
      }));
    }
  };

  const handleRegister = async (role: UserRole, formData: any) => {
    setLoading(true);
    try {
      // Validate required documents for non-patient roles
      if (role !== 'patient') {
        const missingDocs = requiredDocs.filter(doc => !selectedFiles[doc.type]);
        if (missingDocs.length > 0) {
          toast({
            title: "Missing Documents",
            description: `Please upload the following documents: ${missingDocs.map(d => d.label).join(', ')}`,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const userData = {
        ...formData,
        role,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined
      };

      // Register user with verification service
      const result = await verificationService.registerUser(formData.email, formData.password, role, userData);
      
      if (result.success && role !== 'patient') {
        // Upload verification documents
        for (const doc of requiredDocs) {
          if (selectedFiles[doc.type]) {
            await verificationService.uploadVerificationDocument(
              result.userId,
              selectedFiles[doc.type],
              doc.type as any
            );
          }
        }
      }

      toast({
        title: "Registration Submitted",
        description: role === 'patient' 
          ? "Please check your email to verify your account."
          : "Your registration is pending review. We'll notify you once your account is verified.",
      });

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join TeleMed Rural</h1>
          <p className="text-lg text-gray-600">Connecting rural communities with quality healthcare</p>
        </div>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient">Patient Registration</TabsTrigger>
            <TabsTrigger value="doctor">Doctor Registration</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
                <CardDescription>
                  Register as a patient to book appointments and consult with doctors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input
                      id="patient-name"
                      value={patientForm.full_name}
                      onChange={(e) => setPatientForm({...patientForm, full_name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient-password">Password</Label>
                    <Input
                      id="patient-password"
                      type="password"
                      value={patientForm.password}
                      onChange={(e) => setPatientForm({...patientForm, password: e.target.value})}
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <Input
                      id="patient-phone"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient-dob">Date of Birth</Label>
                    <Input
                      id="patient-dob"
                      type="date"
                      value={patientForm.date_of_birth}
                      onChange={(e) => setPatientForm({...patientForm, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="patient-gender">Gender</Label>
                    <Select onValueChange={(value) => setPatientForm({...patientForm, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="patient-address">Address</Label>
                  <Input
                    id="patient-address"
                    value={patientForm.address}
                    onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <Label htmlFor="patient-emergency">Emergency Contact</Label>
                  <Input
                    id="patient-emergency"
                    value={patientForm.emergency_contact}
                    onChange={(e) => setPatientForm({...patientForm, emergency_contact: e.target.value})}
                    placeholder="Emergency contact phone number"
                  />
                </div>

                <Button 
                  onClick={() => handleRegister('patient', patientForm)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Registering..." : "Register as Patient"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Registration</CardTitle>
                <CardDescription>
                  Register as a doctor to provide consultations to patients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-name">Full Name</Label>
                    <Input
                      id="doctor-name"
                      value={doctorForm.full_name}
                      onChange={(e) => setDoctorForm({...doctorForm, full_name: e.target.value})}
                      placeholder="Dr. Full Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      placeholder="doctor@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctor-phone">Phone Number</Label>
                    <Input
                      id="doctor-phone"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-specialization">Specialization</Label>
                    <Select onValueChange={(value) => setDoctorForm({...doctorForm, specialization: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-medicine">General Medicine</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="gynecology">Gynecology</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="doctor-license">License Number</Label>
                    <Input
                      id="doctor-license"
                      value={doctorForm.license_number}
                      onChange={(e) => setDoctorForm({...doctorForm, license_number: e.target.value})}
                      placeholder="Medical license number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-experience">Years of Experience</Label>
                    <Input
                      id="doctor-experience"
                      type="number"
                      value={doctorForm.experience_years}
                      onChange={(e) => setDoctorForm({...doctorForm, experience_years: e.target.value})}
                      placeholder="Years of experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctor-fee">Consultation Fee (₹)</Label>
                    <Input
                      id="doctor-fee"
                      type="number"
                      value={doctorForm.consultation_fee}
                      onChange={(e) => setDoctorForm({...doctorForm, consultation_fee: e.target.value})}
                      placeholder="Consultation fee"
                    />
                  </div>
                </div>

                {requiredDocs.length > 0 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>Document Verification Required</AlertTitle>
                      <AlertDescription>
                        Please upload the following documents. Your registration will be reviewed by our admin team.
                      </AlertDescription>
                    </Alert>
                    
                    {requiredDocs.map((doc) => (
                      <div key={doc.type}>
                        <Label htmlFor={`doctor-${doc.type}`}>{doc.label}</Label>
                        <Input
                          id={`doctor-${doc.type}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange(doc.type)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={() => handleRegister('doctor', doctorForm)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Registering..." : "Register as Doctor"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Registration</CardTitle>
                <CardDescription>
                  Register your pharmacy to manage medicine inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pharmacy-contact-name">Contact Person Name</Label>
                    <Input
                      id="pharmacy-contact-name"
                      value={pharmacyForm.full_name}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, full_name: e.target.value})}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pharmacy-email">Email</Label>
                    <Input
                      id="pharmacy-email"
                      type="email"
                      value={pharmacyForm.email}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, email: e.target.value})}
                      placeholder="pharmacy@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pharmacy-password">Password</Label>
                    <Input
                      id="pharmacy-password"
                      type="password"
                      value={pharmacyForm.password}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, password: e.target.value})}
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pharmacy-phone">Phone Number</Label>
                    <Input
                      id="pharmacy-phone"
                      value={pharmacyForm.phone}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                  <Input
                    id="pharmacy-name"
                    value={pharmacyForm.pharmacy_name}
                    onChange={(e) => setPharmacyForm({...pharmacyForm, pharmacy_name: e.target.value})}
                    placeholder="Your pharmacy name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pharmacy-license-id">Pharmacy License ID</Label>
                    <Input
                      id="pharmacy-license-id"
                      value={pharmacyForm.license_id}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, license_id: e.target.value})}
                      placeholder="License ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pharmacy-location">Location</Label>
                    <Input
                      id="pharmacy-location"
                      value={pharmacyForm.location}
                      onChange={(e) => setPharmacyForm({...pharmacyForm, location: e.target.value})}
                      placeholder="Pharmacy location"
                    />
                  </div>
                </div>

                {requiredDocs.length > 0 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>Document Verification Required</AlertTitle>
                      <AlertDescription>
                        Please upload the following documents. Your registration will be reviewed by our admin team.
                      </AlertDescription>
                    </Alert>
                    
                    {requiredDocs.map((doc) => (
                      <div key={doc.type}>
                        <Label htmlFor={`pharmacy-${doc.type}`}>{doc.label}</Label>
                        <Input
                          id={`pharmacy-${doc.type}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange(doc.type)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={() => handleRegister('pharmacy', pharmacyForm)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Registering..." : "Register Pharmacy"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Button variant="link" onClick={() => window.location.reload()}>
              Sign In
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;