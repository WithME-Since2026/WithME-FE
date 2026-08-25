export const colors = {
  primary: '#162a56',
  secondary: '#7C3AED',
  // 알림/탭바 등의 강조 상태에 쓰이는 브라이트 블루 (primary와는 별개 톤)
  accent: '#4A90FA',
  // accent를 옅게 깐 배경 (알림 아바타 등 강조 아이콘 배경용)
  accentSoft: '#E0EAFF',
  // 강조가 필요 없는 중립 아이콘의 배경/전경 (알림 아바타 등)
  neutralSoft: '#F0F1F4',
  neutralIcon: '#6B7080',
  neutralBorder: '#D8DAE2',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#99999E',
    disabled: '#BFBFC4',
  },
  error: '#EB4747',
  success: '#33B96B',
  border: '#E5E7EB',
  borderStrong: '#9CA3AF',
  divider: 'rgba(0, 0, 0, 0.08)',
  // 통계 카드 구분선, 낮은 참석률 막대 등에 쓰이는 연한 회색 (mypage)
  hairline: '#DCD8D3',
  // 마이페이지 참석률 카드 전용 그린 계열 (기존 success 토큰과는 별개 톤)
  attendanceHigh: '#45A64A',
  attendanceMid: '#BDE1BF',
  attendanceTrack: '#EFECE8',
  // 프리미엄 업그레이드 배너 테두리/PRO 배지에 쓰이는 골드
  premiumGold: '#C8A84B',
  weekend: '#cc4d4da3',
  // 카카오 브랜드 가이드 고정 컬러
  kakao: '#FEE500',
  kakaoText: '#191919',
  kakaoBadgeText: '#4D3800',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  heading2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30 },
  heading3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const theme = { colors, spacing, typography, borderRadius };
