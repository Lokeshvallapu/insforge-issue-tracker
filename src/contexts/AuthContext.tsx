import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string; requireEmailVerification?: boolean; email?: string }>;
  verifyEmail: (email: string, otp: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (!error && data?.user) {
        setUser(data.user as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });
    if (data?.user) {
      setUser(data.user as User);
    }
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await insforge.auth.signUp({ email, password, name });
    if (data?.requireEmailVerification) {
      return { error: error?.message, requireEmailVerification: true, email };
    }
    if (error) return { error: error.message };

    if (data?.user) {
      setUser(data.user as User);
    }

    return { error: undefined };
  };

  const verifyEmail = async (email: string, otp: string) => {
    const { data, error } = await insforge.auth.verifyEmail({ email, otp });
    if (error) return { error: error.message };

    if (data?.user) {
      setUser(data.user as User);
    }

    return { error: undefined };
  };

  const signOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, verifyEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};