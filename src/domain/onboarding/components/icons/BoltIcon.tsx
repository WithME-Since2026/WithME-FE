import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/common/styles/theme';

type BoltIconProps = {
  size?: number;
  color?: string;
};

// "자동으로 재확인 요청" 버튼처럼 자동화/즉시성을 나타낼 때 쓰는 번개 아이콘
export function BoltIcon({ size = 16, color = colors.primary }: BoltIconProps) {
  return <Ionicons name="flash" size={size} color={color} />;
}
