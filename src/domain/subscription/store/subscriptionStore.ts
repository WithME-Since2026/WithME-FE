import { create } from 'zustand';

type SubscriptionState = {
  isPremium: boolean;
  activatePremium: () => void;
  clearSubscription: () => void;
};

// TODO: 결제(PG) API가 아직 명세되지 않아 우선 로컬 상태로만 프리미엄 여부 관리
export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  isPremium: false,
  activatePremium: () => set({ isPremium: true }),
  // 로그아웃 시 다음 로그인 사용자에게 이전 계정의 프리미엄 상태가 남지 않도록 초기화
  clearSubscription: () => set({ isPremium: false }),
}));
