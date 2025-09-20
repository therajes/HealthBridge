import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Stethoscope, Users, Building2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoCredentials = [
    { role: 'Patient', email: 'patient@demo.com', icon: Stethoscope, color: 'text-success' },
    { role: 'Doctor', email: 'doctor@demo.com', icon: Users, color: 'text-primary' },
    { role: 'Pharmacy', email: 'pharmacy@demo.com', icon: Building2, color: 'text-warning' },
    { role: 'Admin', email: 'admin@demo.com', icon: Shield, color: 'text-emergency' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to TeleMed MediCall!",
        });
      } else {
        toast({
          title: "Login Failed", 
          description: "Invalid credentials. Please use demo credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('12345');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">TeleMed</h1>
                <p className="text-xs text-muted-foreground">MediCall Nabha</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Connecting Nabha to 
                <span className="text-primary"> Quality Healthcare</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Bridge the healthcare gap with our telemedicine platform. Get consultations, 
                prescriptions, and medicine availability checks from anywhere in Nabha and surrounding areas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-primary">1,250+</div>
                <div className="text-sm text-muted-foreground">Active Patients</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-success">45+</div>
                <div className="text-sm text-muted-foreground">Qualified Doctors</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-warning">18+</div>
                <div className="text-sm text-muted-foreground">Partner Pharmacies</div>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-card">
                <div className="text-2xl font-bold text-emergency">87.5%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <Card className="shadow-medical">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Login to TeleMed</CardTitle>
                <CardDescription>
                  Choose your role or use demo credentials to explore
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="medical" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {demoCredentials.map((cred) => {
                    const Icon = cred.icon;
                    return (
                      <Button
                        key={cred.role}
                        variant="outline"
                        className="h-auto p-3 flex-col space-y-2"
                        onClick={() => quickLogin(cred.email)}
                      >
                        <Icon className={`h-5 w-5 ${cred.color}`} />
                        <span className="text-xs font-medium">{cred.role}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="text-xs text-center text-muted-foreground">
                  Demo password for all accounts: <span className="font-mono">12345</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;