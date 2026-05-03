import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  username?: string;
} 

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  lastUsedProvider: string | null;
  setSession: (user: User | null) => void;
  setLastProvider: (provider: "GOOGLE" | "GITHUB" | "CREDENTIALS") => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  lastUsedProvider: typeof window !== 'undefined' ? localStorage.getItem('runit_last_provider') : null,

  setSession: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  setLastProvider: (provider) => {
    localStorage.setItem('runit_last_provider', provider);
    set({ lastUsedProvider: provider });
  },

  clearAuth: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));