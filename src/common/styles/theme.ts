export const colors = {
  primary: '#4A90FA',
  secondary: '#7C3AED',
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
  // 카카오 브랜드 가이드 고정 컬러
  kakao: '#FEE500',
  kakaoText: '#191919',
  // 모임 홈/상세/생성 플로우 전용 다크 카드 팔레트 (Figma "모임" 섹션 고정 컬러)
  meeting: {
    cardBackground: '#2B2F42',
    cardDivider: '#333361',
    mutedText: '#9E9ECC',
    operatorBadge: '#4A90FA',
    participantBadge: '#0A705C',
    dDayBackground: 'rgba(128, 153, 255, 0.35)',
    dDayBorder: '#C9CCE0',
    filterTabBackground: '#E8E8EC',
    attending: '#33D496',
    attendingBackground: '#D0F5E4',
    notAttending: '#FB7190',
    pending: '#858CA6',
    waiting: '#D97706',
    waitingBackground: '#FFF0CC',
    inProgress: '#4A90FA',
    inProgressBackground: '#DBEAFF',
  },
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
