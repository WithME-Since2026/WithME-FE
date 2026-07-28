import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/common/styles/theme';

type LinkIconProps = {
  size?: number;
  color?: string;
};

// 초대 링크 입력창 앞에 붙는 체인 링크 아이콘
export function LinkIcon({ size = 16, color = colors.text.secondary }: LinkIconProps) {
  return <Ionicons name="link" size={size} color={color} />;
}
