import { useSubscriptionStore } from '@/domain/subscription/store/subscriptionStore';

// TODO: 결제(PG) API가 아직 명세되지 않아 우선 로컬 상태로만 프리미엄 활성화 처리
export function useActivatePremium() {
  return useSubscriptionStore((state) => state.activatePremium);
}
