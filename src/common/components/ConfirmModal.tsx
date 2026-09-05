import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type ConfirmModalProps = {
  visible: boolean;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

// 로그아웃/탈퇴처럼 되돌리기 애매한 액션 전에 한 번 더 확인받는 공용 확인 모달
export function ConfirmModal({
  visible,
  message,
  cancelLabel = '아니요',
  confirmLabel = '예',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  message: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
  },
  cancelLabel: {
    ...typography.body1,
    fontSize: 15,
    color: colors.text.primary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmLabel: {
    ...typography.body1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
});
