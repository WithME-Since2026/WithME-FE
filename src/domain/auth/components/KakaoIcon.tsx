import { Image, StyleSheet } from 'react-native';

import kakaoIcon from '@/assets/icons/KakaoIcon.png';

// 카카오 로그인 버튼 전용 말풍선 아이콘
export function KakaoIcon() {
  return <Image source={kakaoIcon} style={styles.icon} />;
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
