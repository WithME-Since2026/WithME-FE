import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/common/styles/theme';

type ChatBubbleIconProps = {
  size?: number;
  color?: string;
};

// "카카오로 공유" 버튼 등 대화/공유 액션 앞에 붙는 말풍선 아이콘
export function ChatBubbleIcon({ size = 16, color = colors.text.primary }: ChatBubbleIconProps) {
  return <Ionicons name="chatbubble-ellipses" size={size} color={color} />;
}
