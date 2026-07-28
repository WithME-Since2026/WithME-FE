import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/common/styles/theme';

type BellIconProps = {
  size?: number;
  color?: string;
};

// 일정 변경 알림 카드 상단에 쓰는 종 모양 아이콘
export function BellIcon({ size = 16, color = colors.primary }: BellIconProps) {
  return <Ionicons name="notifications" size={size} color={color} />;
}
