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
  // 알림 유형별 아바타 배경/아이콘 색상 (Figma node 761:15618 실제 값)
  notifJoinBg: '#D3E3FD',
  notifScheduleBg: '#FEF3C7',
  notifScheduleIcon: '#D97706',
  notifDeadlineBg: '#E7E0EC',
  notifDeadlineIcon: '#79747E',
  notifReceivedBg: '#DCFCE7',
  notifReceivedIcon: '#16A34A',
  // 알림 읽음 상태의 본문/타임스탬프/구분선 색상 (Figma 실제 값)
  notifReadText: '#49454F',
  notifTimestamp: '#CAC4D0',
  notifDivider: '#E8E0F0',
  // 액션 완료 토스트 배경 (Figma 실제 값)
  toastBackground: '#313033',
  // 아웃라인 버튼 테두리 등에 쓰이는 중립 회색 (마이페이지 편집 버튼 등, Figma 실제 값)
  outlineVariant: '#CAC4D0',
  // 프리미엄 배너 전용 텍스트 색상 (Figma 실제 값)
  premiumTitleText: '#1A1A1A',
  // 마이페이지 등에서 반복적으로 쓰이는 회색 보조 텍스트 (Figma 실제 값, text.secondary와는 별개 톤)
  textMuted: '#807F7D',
  // 마이페이지 제목/닉네임/통계 수치 등 굵은 강조 텍스트 (Figma 실제 값, text.primary와는 별개 톤)
  textStrong: '#1A1A1A',
  // 카카오 브랜드 가이드 고정 컬러
  kakao: '#FEE500',
  kakaoText: '#191919',
  kakaoBadgeText: '#4D3800',
  // 마이페이지 프로필 카드의 "카카오 계정 연결됨" 배지 전용 색상 (Figma 실제 값 — 카카오 브랜드 기본색과는 톤이 미묘하게 다름)
  kakaoBadgeBg: '#FCE500',
  kakaoBadgeDot: '#371C1D',
  // 마이페이지 "내 모임 관리" 배지 등에 쓰이는 구글 블루 계열 (Figma 실제 값, primary/accent와는 별개 톤)
  linkBlue: '#1A73E8',
  linkBlueSoft: '#D3E3FD',
  // 마이페이지 "결제수단 등록" 배지 배경 (Figma 실제 값)
  settingsBadgeBg: '#F3EDF7',
  // 마이페이지 최근 6주 참석 차트 전용 그린 계열 (Figma 실제 값, attendanceHigh/Mid와는 별개 톤)
  weeklyChartHigh: '#16A34A',
  weeklyChartMid: '#86EFAC',
  weeklyChartLow: '#DCFCE7',
  // 마이페이지 회원 탈퇴 등 파괴적 액션 텍스트 (Figma 실제 값, error 토큰과는 별개 톤)
  destructiveText: '#DC2626',
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
