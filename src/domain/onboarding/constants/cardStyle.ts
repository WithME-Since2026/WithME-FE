// 온보딩 카드 전용 파스텔 배경 + 그림자 + 축소 텍스트 값
// common/styles/theme.ts에는 없는 온보딩 도메인 전용 값이라 여기서 별도 관리
export const ONBOARDING_PASTEL = {
  blue: '#E1E4F2',
  green: '#E1F2E7',
  pink: '#F2E1E6',
};

export const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

export const tinyText = { fontSize: 11, fontWeight: '400' as const, lineHeight: 15 };
