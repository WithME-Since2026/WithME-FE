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
  // 모임 홈/상세/생성 플로우 전용 팔레트 (Figma "모임" 섹션 고정 컬러)
  meeting: {
    primary: '#1A73E8',
    badgeBackground: '#D3E3FD',
    participantCardBorder: '#C9CCE0',
    outlineBorder: '#E8E0F0',
    mutedText: '#49454F',
    strongText: '#1C1B1F',
    progressTrack: '#E7E0EC',
    notAttending: '#DC2626',
    pendingText: '#CAC4D0',
    dotInactive: '#D1D5DB',
    statusInProgressBackground: '#D3E3FD',
    statusInProgressText: '#1A73E8',
    statusDoneBackground: '#F3F4F6',
    statusDoneText: '#9CA3AF',
    statusAttendingBorder: '#16A34A',
    statusAttendingBackground: '#DCFCE7',
    statusAttendingText: '#16A34A',
    statusWaitingBackground: '#FFF0CC',
    statusWaitingText: '#D97706',
    stepCompleted: '#1F9D6B',
    inputBackground: '#F5F5F7',
    inputBorder: '#E5E7EA',
    placeholderText: '#B8B8BF',
    stepNavPrevBackground: '#F6F6F6',
    stepNavPrevBorder: '#D9D9D9',
    stepNavPrevText: '#737373',
  },
  // 모임 상세(밝은 배경) 화면의 참석 현황 배지/진행바 전용 팔레트
  attendanceStatus: {
    attending: '#05966A',
    attendingBackground: '#D0F5E4',
    notAttending: '#DC2626',
    notAttendingBackground: '#FCDEDE',
    pending: '#6B7280',
    pendingBackground: '#EBEBED',
    progressPending: '#D1D1D9',
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
