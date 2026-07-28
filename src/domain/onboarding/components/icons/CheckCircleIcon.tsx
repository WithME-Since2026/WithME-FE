import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/common/styles/theme';

type CheckCircleIconProps = {
  size?: number;
  color?: string;
};

// 참석 확인/완료 표시에 쓰는 원형 체크 아이콘
export function CheckCircleIcon({ size = 16, color = colors.success }: CheckCircleIconProps) {
  return <Ionicons name="checkmark-circle" size={size} color={color} />;
}
