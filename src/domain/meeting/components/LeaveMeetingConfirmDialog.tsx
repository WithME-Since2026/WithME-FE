import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type LeaveMeetingConfirmDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LeaveMeetingConfirmDialog({
  visible,
  onCancel,
  onConfirm,
}: LeaveMeetingConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>모임을 나가시겠어요?</Text>
          <Text style={styles.description}>나가면 모든 모임 데이터에 접근할 수 없게 됩니다.</Text>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelLabel}>취소</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.confirmLabel}>나가기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.strongText,
  },
  description: {
    ...typography.caption,
    color: colors.meeting.mutedText,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
  },
  confirmButton: {
    backgroundColor: colors.meeting.notAttending,
  },
  cancelLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.meeting.strongText,
  },
  confirmLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.background,
  },
});
