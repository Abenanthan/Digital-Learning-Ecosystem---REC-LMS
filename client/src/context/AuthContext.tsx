'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import api, { setAccessTokenGetter } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: 'STUDENT' | 'TEACHER') => Promise<User>;
  logout: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Role → Dashboard path mapping ─────────────────────────────────────────────

export function getDashboardPath(role: User['role']): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'STUDENT':
    default:
      return '/student';
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Access token stored entirely in memory — never written to localStorage
  const accessTokenRef = useRef<string | null>(null);

  // Wire up the token getter so the Axios interceptor can read it
  useEffect(() => {
    setAccessTokenGetter(() => accessTokenRef.current);
  }, []);

  // ── Bootstrap: attempt to restore session via refresh-token cookie ──────────
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        // The httpOnly refresh-token cookie is sent automatically
        const { data } = await api.post('/auth/refresh');
        if (cancelled) return;

        accessTokenRef.current = data.data.accessToken;
        setUser(data.data.user);
      } catch {
        // No valid session — user stays unauthenticated
        accessTokenRef.current = null;
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });

      // Store access token in memory only
      accessTokenRef.current = data.data.accessToken;

      const loggedInUser: User = data.data.user;
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string, role: 'STUDENT' | 'TEACHER'): Promise<User> => {
      setIsLoading(true);
      try {
        const { data } = await api.post('/auth/register', { name, email, password, role });

        accessTokenRef.current = data.data.accessToken;

        const newUser: User = data.data.user;
        setUser(newUser);
        return newUser;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Server-side cleanup failed — proceed with client-side cleanup anyway
    } finally {
      accessTokenRef.current = null;
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
