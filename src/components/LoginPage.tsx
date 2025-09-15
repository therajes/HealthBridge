import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, MapPin, Phone, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RegisterPage from '@/components/auth/RegisterPage';

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to TeleMed Rural!",
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

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to TeleMed Rural!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Could not sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showRegister) {
    return <RegisterPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">TeleMed Rural</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowRegister(true)}
              className="flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Button>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Emergency: 108</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Greater Noida, India</span>
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
                Connecting Rural Communities to 
                <span className="text-primary"> Quality Healthcare</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Bridge the healthcare gap with our telemedicine platform. Get consultations, 
                prescriptions, and medicine availability checks from the comfort of your village.
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
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  Don't have an account? <button onClick={() => setShowRegister(true)} className="text-primary hover:underline">Register here</button>
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