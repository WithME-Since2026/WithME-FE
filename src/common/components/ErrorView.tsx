import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

type ErrorViewProps = {
  message?: string;
};

export function ErrorView({ message = '오류가 발생했습니다.' }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  message: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
