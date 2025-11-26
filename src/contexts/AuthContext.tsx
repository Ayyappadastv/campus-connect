import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@college.edu',
    password: 'password123',
    role: 'student',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    department: 'IT Services',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Super Admin',
    email: 'superadmin@college.edu',
    password: 'super123',
    role: 'superadmin',
    createdAt: new Date('2023-12-01'),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (name: string, email: string, password: string, role: UserRole = 'student'): Promise<{ success: boolean; error?: string }> => {
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role,
      createdAt: new Date(),
    };

    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
