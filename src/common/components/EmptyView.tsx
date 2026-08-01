import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

type EmptyViewProps = {
  message?: string;
};

export function EmptyView({ message = '데이터가 없습니다.' }: EmptyViewProps) {
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
