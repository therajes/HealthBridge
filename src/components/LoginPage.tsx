import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, MapPin, Phone, UserPlus, Users, Stethoscope, Building, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import RegisterPage from '@/components/auth/RegisterPage';

const LoginPage = () => {
  const { login, loginWithGoogle, loginDemo } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Demo accounts for quick fill
  const demoAccounts = [
    { role: 'Patient', name: 'Krishna Yadav', email: 'patient@demo.com', password: 'demo123' },
    { role: 'Doctor', name: 'Rachit Mishra', email: 'doctor@demo.com', password: 'demo123' },
    { role: 'Pharmacy', name: 'Mohit Pharmaceutics', email: 'pharmacy@demo.com', password: 'demo123' },
    { role: 'Admin', name: 'Rajesh Barik', email: 'admin@demo.com', password: 'demo123' },
  ];

  const handleDemoFill = (account: { role: string; name: string; email: string; password: string }) => {
    setEmail(account.email);
    setPassword(account.password);
    toast({
      title: 'Demo account selected',
      description: `${account.role}: ${account.name} — you can adjust the fields before signing in.`,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try demo login first for known demo accounts
      const demoTried = ['patient@demo.com','doctor@demo.com','pharmacy@demo.com','admin@demo.com'].includes(email);
      const success = demoTried ? await loginDemo(email, password) : await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to TeleMed Rural!",
        });
      } else {
        toast({
          title: "Login Failed", 
          description: "Invalid credentials. For demos, use: patient@demo.com / doctor@demo.com / pharmacy@demo.com / admin@demo.com with password demo123.",
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
    <div className="min-h-screen bg-medical-hero relative overflow-hidden">
      {/* Premium Navigation */}
      <motion.header 
        className="absolute top-0 left-0 right-0 z-50 nav-premium"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container-premium">
          <div className="flex justify-between items-center h-24 py-4">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div 
                className="relative p-3 rounded-2xl glass-premium border-premium"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Activity className="h-7 w-7 text-gradient" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">TeleMed</h1>
                <p className="text-xs text-muted-foreground">Premium Healthcare</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowRegister(true)}
                  className="btn-premium flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
              
              <div className="hidden md:flex items-center space-x-4 glass-premium px-4 py-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-emergency" />
                  <span className="text-sm font-medium">Emergency: 108</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm">Greater Noida</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container-premium pt-40 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-24 items-center w-full max-w-7xl mx-auto">
          {/* Premium Hero Section */}
          <motion.div 
            className="space-y-10 pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 glass-premium px-4 py-2 rounded-full mb-8">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Premium Healthcare Experience</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                  <span className="text-foreground">Connecting</span><br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Rural Communities</span><br />
                  <span className="text-foreground">to </span>
                  <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Premium Care</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Experience the future of healthcare with our revolutionary telemedicine platform. 
                Get world-class consultations, instant prescriptions, and real-time medicine 
                availability from the comfort of your home.
              </motion.p>
            </div>
            
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { icon: Users, count: '1,250+', label: 'Active Patients', color: 'text-primary' },
                { icon: Stethoscope, count: '45+', label: 'Expert Doctors', color: 'text-secondary' },
                { icon: Building, count: '18+', label: 'Partner Pharmacies', color: 'text-accent' },
                { icon: Shield, count: '99.9%', label: 'Uptime Guarantee', color: 'text-success' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={index}
                    className="glass-card-premium p-8 rounded-2xl group"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.2 + (index * 0.1), duration: 0.6 }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`p-3 rounded-xl ${stat.color} bg-current/10`}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </motion.div>
                      <div>
                        <div className={`text-3xl font-black ${stat.color}`}>
                          {stat.count}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Premium Login Section */}
          <motion.div 
            className="space-y-8 pl-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="glass-card-premium border-premium backdrop-blur-xl">
                <CardHeader className="text-center space-y-4 pb-8">
                  <motion.div
                    className="mx-auto p-4 rounded-2xl glass-premium w-fit"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Activity className="h-12 w-12 text-primary" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      Welcome Back
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      Sign in to access your premium healthcare dashboard
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 px-8 pb-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 text-lg glass-premium border-premium"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 text-lg glass-premium border-premium"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-14 text-lg btn-premium" 
                        disabled={loading}
                      >
                        <span>{loading ? 'Signing in...' : 'Access Dashboard'}</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </form>

                {/* Premium Demo Accounts */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 glass-premium px-3 py-1 rounded-full">
                      <Sparkles className="h-3 w-3 text-accent" />
                      <span className="text-xs text-gradient font-medium uppercase tracking-wider">
                        Premium Demo Accounts
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {demoAccounts.map((acct, index) => {
                      const icons = {
                        'Patient': Users,
                        'Doctor': Stethoscope,
                        'Pharmacy': Building,
                        'Admin': Shield
                      };
                      const Icon = icons[acct.role as keyof typeof icons] || Users;
                      
                      return (
                        <motion.div
                          key={acct.email}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 1.4 + (index * 0.1), duration: 0.4 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDemoFill(acct)}
                            className="w-full h-auto p-4 glass-card-premium border-premium group hover:border-primary/50"
                            aria-label={`Use ${acct.role} demo account`}
                          >
                            <div className="flex flex-col items-center space-y-3">
                              <motion.div
                                className="p-2 rounded-lg bg-current/10"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                              >
                                <Icon className="h-5 w-5 text-primary" />
                              </motion.div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                                  {acct.role}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {acct.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground/70 mt-1 font-mono">
                                  {acct.email.split('@')[0]}@...
                                </div>
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <motion.p 
                    className="text-xs text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                  >
                    Click any demo card to auto-fill credentials and explore the platform
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="relative my-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="glass-premium px-4 py-2 text-xs text-muted-foreground rounded-full">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleLogin}
                    className="w-full h-14 glass-premium border-premium hover:border-blue-500/50 hover:bg-blue-500/5 group"
                  >
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
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
                      <span className="text-lg font-medium">Continue with Google</span>
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground">
                    New to TeleMed? {' '}
                    <motion.button 
                      onClick={() => setShowRegister(true)} 
                      className="text-primary font-semibold hover:text-primary-glow transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Premium Account
                    </motion.button>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;