import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  hasGithubToken: boolean;
  
  setSession: (user: User | null, hasGithubToken?: boolean) => void;
  setLastProvider: (provider: "GOOGLE" | "GITHUB" | "CREDENTIALS") => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hasGithubToken: false,
      lastUsedProvider: typeof window !== 'undefined' ? localStorage.getItem('runit_last_provider') : null,

      setSession: (user, hasGithubToken) => set((state) => ({
        user,
        isAuthenticated: !!user,
        hasGithubToken: hasGithubToken !== undefined ? hasGithubToken : state.hasGithubToken
      })),

      setLastProvider: (provider) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('runit_last_provider', provider);
        }
        set({ lastUsedProvider: provider });
      },

      clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false,
        hasGithubToken: false
      }),
    }),
    {
      name: 'runit-auth-storage', 
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        hasGithubToken: state.hasGithubToken,
      }),
    }
  )
);