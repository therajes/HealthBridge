import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Activity, Phone, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">TeleMed MediCall</h1>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              Connecting Nabha to Quality Healthcare
            </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-right">
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className={`text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;