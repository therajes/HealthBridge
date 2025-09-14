import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContext as IAuthContext } from '@/types/auth';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserCredential,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { demoUsers } from '@/data/mockData';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a demo session exists, hydrate it immediately
    const demoJson = localStorage.getItem('demoUser');
    if (demoJson) {
      try {
        const demo = JSON.parse(demoJson);
        setUser(demo);
        setLoading(false);
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        // If demo session is active, do not override with Firebase null
        const demoActive = !!localStorage.getItem('demoUser');
        if (demoActive) {
          setLoading(false);
          return;
        }
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as any;
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || data.email || '',
              name: data.name || firebaseUser.displayName || '',
              role: data.role || 'patient',
              avatar: firebaseUser.photoURL || data.avatar,
              location: data.location,
              phone: data.phone,
              specialization: data.specialization,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            });
          } else {
            // Create a minimal user profile with default role if none exists
            await setDoc(userRef, {
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'patient',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'patient',
              avatar: firebaseUser.photoURL || undefined,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state handling error:', error);
        setUser(firebaseUser ? {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'patient',
          avatar: firebaseUser.photoURL || undefined,
        } : null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isDemoEmail = (email: string) => (
    email === 'patient@demo.com' ||
    email === 'doctor@demo.com' ||
    email === 'pharmacy@demo.com' ||
    email === 'admin@demo.com'
  );

  const loginDemo = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const demo = demoUsers.find(u => u.email === email && u.password === password);
      if (!demo) return false;
      const demoUser: User = {
        id: demo.id,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        avatar: undefined,
        phone: demo.phone,
        location: demo.location,
        specialization: demo.specialization,
      };
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      return true;
    } catch (error) {
      console.error('Demo login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isDemoEmail(email)) {
      // Always bypass Firebase for known demo accounts
      return loginDemo(email, password);
    }
    try {
      setLoading(true);
      // Clear any previous demo session
      localStorage.removeItem('demoUser');
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with additional data
      await updateProfile(firebaseUser, {
        displayName: userData.name,
        photoURL: userData.avatar
      });

      // Persist user profile in Firestore with role and metadata
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        email,
        name: userData.name || '',
        role: userData.role || 'patient',
        avatar: userData.avatar || null,
        phone: userData.phone || null,
        location: userData.location || null,
        specialization: userData.specialization || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const hadDemo = !!localStorage.getItem('demoUser');
      localStorage.removeItem('demoUser');
      setUser(null);
      if (!hadDemo) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginDemo,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};