export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  specialization?: string; // for doctors
  location?: string; // for patients and pharmacies
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemo: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
