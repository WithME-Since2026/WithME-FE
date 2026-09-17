import { Image, StyleSheet, View } from 'react-native';

import { borderRadius, colors } from '@/common/styles/theme';

import kakaoIcon from '@/assets/icons/KakaoIcon.png';

type KakaoIconProps = {
  size?: number;
  // true면 Figma 카카오 브랜드 마크처럼 노란 원형 배경 위에 말풍선을 올려 그림
  // (연결된 계정 카드, 프리미엄 배너 등 배지로 쓸 때. 카카오 로그인 버튼은 버튼 자체가 이미 노란색이라 기본값 false)
  background?: boolean;
};

export function KakaoIcon({ size = 24, background = false }: KakaoIconProps) {
  if (!background) {
    return <Image source={kakaoIcon} style={{ width: size, height: size }} />;
  }

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Image source={kakaoIcon} style={{ width: size * 0.75, height: size * 0.75 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.kakao,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
