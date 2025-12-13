import type UserInterface from '@/types/UserInterface';
import { create } from 'zustand';

interface AuthState {
  user: UserInterface | undefined | null;
  setUser: (user: UserInterface | undefined | null) => void;
}

// Хук для управления состоянием авторизации
export const useAuth = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user: UserInterface | undefined | null) => set({ user }),
}));