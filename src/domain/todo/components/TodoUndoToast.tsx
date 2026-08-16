import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type TodoUndoToastProps = {
  message: string;
  secondsLeft: number;
  onUndo: () => void;
};

// 미루기 직후 화면 하단에 뜨는 실행취소 토스트 (Figma 6c 미루기 Undo 토스트)
export function TodoUndoToast({ message, secondsLeft, onUndo }: TodoUndoToastProps) {
  return (
    <View style={styles.toast}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.undoButton} onPress={onUndo}>
        <Text style={styles.undoText}>Undo {secondsLeft}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 60,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  message: {
    ...typography.body2,
    fontSize: 13,
    fontWeight: '500',
    color: colors.background,
  },
  undoButton: {
    height: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
});
