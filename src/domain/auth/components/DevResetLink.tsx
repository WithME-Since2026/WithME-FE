import { Pressable, StyleSheet, Text } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type DevResetLinkProps = {
  // 화면별로 제네릭 route name이 달라 전체 navigation 타입 대신 필요한 메서드만 구조적으로 요구
  navigation: Pick<NativeStackNavigationProp<RootStackParamList>, 'popToTop'>;
};

// TODO: 계정 찾기 플로우 테스트용 임시 컴포넌트. 실기기/시뮬레이터에서 확인 후 PR 전 제거
export function DevResetLink({ navigation }: DevResetLinkProps) {
  if (!__DEV__) {
    return null;
  }

  return (
    <Pressable style={styles.link} onPress={() => navigation.popToTop()} hitSlop={8}>
      <Text style={styles.linkText}>[dev] 처음 화면으로</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
  },
});
