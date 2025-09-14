import { User } from '@/types/auth';

// Mock user data
const mockUsers: Record<string, User> = {
  'patient@demo.com': {
    id: '1',
    email: 'patient@demo.com',
    password: 'demo123', // In a real app, this would be hashed
    name: 'John Doe',
    role: 'patient',
    phone: '+1234567890',
    location: '123 Main St'
  },
  'doctor@demo.com': {
    id: '2',
    email: 'doctor@demo.com',
    password: 'demo123',
    name: 'Dr. Jane Smith',
    role: 'doctor',
    phone: '+1234567891',
    specialization: 'General Medicine'
  },
  'pharmacy@demo.com': {
    id: '3',
    email: 'pharmacy@demo.com',
    password: 'demo123',
    name: 'MedCare Pharmacy',
    role: 'pharmacy',
    phone: '+1234567892',
    location: '456 Health St'
  },
  'admin@demo.com': {
    id: '4',
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
    phone: '+1234567893'
  }
};

export const mockAuth = {
  login: async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
    // In this mock version, we'll accept any password for demo accounts
    const user = mockUsers[email];
    if (user) {
      return { user };
    }
    return { user: null, error: 'Invalid credentials' };
  },

  register: async (email: string, password: string, userData: Partial<User>): Promise<{ user: User | null; error?: string }> => {
    if (mockUsers[email]) {
      return { user: null, error: 'Email already exists' };
    }
    
    const newUser: User = {
      id: String(Object.keys(mockUsers).length + 1),
      email,
      ...userData
    } as User;
    
    mockUsers[email] = newUser;
    return { user: newUser };
  },

  logout: async () => {
    // No operation needed for mock logout
    return Promise.resolve();
  }
};
