import { StyleSheet, View } from 'react-native';

import { colors } from '@/common/styles/theme';

// 카카오 로그인 버튼 전용 말풍선 아이콘 (이미지 에셋 없이 View 조합으로 구현)
export function KakaoIcon() {
  return (
    <View style={styles.bubble}>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 18,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.kakaoText,
  },
  tail: {
    position: 'absolute',
    bottom: -3,
    left: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.kakaoText,
  },
});
