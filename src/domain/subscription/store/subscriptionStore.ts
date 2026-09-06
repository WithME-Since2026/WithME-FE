import { create } from 'zustand';

type SubscriptionState = {
  isPremium: boolean;
  activatePremium: () => void;
};

// TODO: 결제(PG) API가 아직 명세되지 않아 우선 로컬 상태로만 프리미엄 여부 관리
export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  isPremium: false,
  activatePremium: () => set({ isPremium: true }),
}));
