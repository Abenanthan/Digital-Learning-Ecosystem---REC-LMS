import { create } from 'zustand';
import api from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  loadFromStorage: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─── Store ──────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  // ── Load persisted token on app startup ──────────────────────────────────
  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (token) {
      set({ accessToken: token, isAuthenticated: true });
    }
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', payload);
      const { user, accessToken } = data;

      localStorage.setItem('accessToken', accessToken);

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // ── Register ──────────────────────────────────────────────────────────────
  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', payload);
      const { user, accessToken } = data;

      localStorage.setItem('accessToken', accessToken);

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed with local cleanup even if the API call fails
    } finally {
      localStorage.removeItem('accessToken');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // ── Refresh Token ─────────────────────────────────────────────────────────
  refreshToken: async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      const { accessToken } = data;

      localStorage.setItem('accessToken', accessToken);
      set({ accessToken, isAuthenticated: true });
    } catch {
      localStorage.removeItem('accessToken');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  // ── Set User ──────────────────────────────────────────────────────────────
  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));
