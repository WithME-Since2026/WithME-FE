import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

type ScreenHeaderProps = {
  title: string;
};

// 뒤로가기 없이 제목만 중앙에 표시하는 화면 상단 헤더 (계정 찾기, 비밀번호 재설정 등)
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
