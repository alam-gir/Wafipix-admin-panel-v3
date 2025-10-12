/**
 * Authentication store using Zustand
 */

import { create } from 'zustand';
import { User } from '../lib/api/types/auth';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: !!user,
      error: null,
    })),

  setLoading: (isLoading) =>
    set((state) => ({
      isLoading,
    })),

  setError: (error) =>
    set((state) => ({
      error,
      isLoading: false,
    })),

  login: (user) =>
    set((state) => ({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })),

  logout: () =>
    set((state) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })),

  clearError: () =>
    set((state) => ({
      error: null,
    })),
}));
