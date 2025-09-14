import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Phone, MapPin, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundFX from '@/components/BackgroundFX';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user) return <>{children}</>;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'text-primary';
      case 'patient':
        return 'text-success';
      case 'pharmacy':
        return 'text-warning';
      case 'admin':
        return 'text-emergency';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="relative min-h-screen bg-premium-hero overflow-hidden">
      <BackgroundFX />
      
      {/* Premium Navigation Header */}
      <motion.header 
        className="sticky top-0 z-50 nav-premium"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container-premium">
          <div className="flex justify-between items-center h-24 py-4">
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="relative p-3 rounded-2xl glass-premium border-premium"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Activity className="h-7 w-7 text-primary" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TeleMed</h1>
                  <p className="text-xs text-muted-foreground">Premium Healthcare</p>
                </div>
              </div>
              
              <motion.div 
                className="hidden lg:block text-sm text-muted-foreground max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Connecting Rural Communities to Premium Healthcare Solutions
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="hidden md:flex items-center space-x-3 glass-premium px-4 py-2 rounded-full">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-gradient-primary"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="text-right">
                  <div className="font-semibold text-foreground text-sm">{user.name}</div>
                  <div className={`text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout} 
                  className="glass-premium border-premium hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Premium Main Content */}
      <motion.main 
        className="relative container-premium pt-8 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {children}
      </motion.main>

      {/* Premium Footer */}
      <motion.footer 
        className="relative glass-premium border-t border-white/10 mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="container-premium py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl glass-premium border-premium">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">TeleMed</h3>
                  <p className="text-xs text-muted-foreground">Premium Healthcare</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Revolutionizing rural healthcare through premium telemedicine solutions and cutting-edge technology.
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground mb-2">
                © 2025 Rajesh and Team
              </p>
              <p className="text-xs text-muted-foreground">
                Bridging Healthcare Gaps with Premium Technology
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col space-y-3 md:items-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center space-x-2 glass-premium px-3 py-2 rounded-full">
                <Phone className="h-4 w-4 text-emergency" />
                <span className="text-sm font-medium text-foreground">Emergency: 108</span>
              </div>
              <div className="flex items-center space-x-2 glass-premium px-3 py-2 rounded-full">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">Greater Noida, India</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;