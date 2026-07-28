import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  userId: number | null;
  setAuth: (userId: number) => void;
  clearAuth: () => void;
};

// TS strict 모드에서 타입 추론이 깨지지 않도록 curried create<T>() 형태 사용
export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  userId: null,
  setAuth: (userId) => set({ isLoggedIn: true, userId }),
  clearAuth: () => set({ isLoggedIn: false, userId: null }),
}));
