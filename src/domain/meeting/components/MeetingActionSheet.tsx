import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type MeetingActionSheetProps = {
  visible: boolean;
  title: string;
  isOperator: boolean;
  onClose: () => void;
  onReschedule?: () => void;
  onEditInfo?: () => void;
  onNotificationSettings?: () => void;
  onLeave: () => void;
  onDelete?: () => void;
};

export function MeetingActionSheet({
  visible,
  title,
  isOperator,
  onClose,
  onReschedule,
  onEditInfo,
  onNotificationSettings,
  onLeave,
  onDelete,
}: MeetingActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>

        {isOperator && (
          <Pressable style={styles.row} onPress={onReschedule}>
            <Text style={styles.rowLabel}>일정 변경</Text>
          </Pressable>
        )}
        {isOperator && (
          <Pressable style={styles.row} onPress={onEditInfo}>
            <Text style={styles.rowLabel}>모임 정보 수정</Text>
          </Pressable>
        )}

        <Pressable style={styles.row} onPress={onNotificationSettings}>
          <Text style={styles.rowLabel}>알림 설정</Text>
        </Pressable>

        <Pressable style={styles.row} onPress={onLeave}>
          <Text style={styles.rowLabelDanger}>모임 나가기</Text>
        </Pressable>

        {isOperator && (
          <Pressable style={[styles.row, styles.rowLast]} onPress={onDelete}>
            <Text style={styles.rowLabelDanger}>모임 삭제</Text>
          </Pressable>
        )}

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelLabel}>취소</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.strongText,
    marginBottom: spacing.sm,
  },
  row: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.body1,
    color: colors.meeting.strongText,
  },
  rowLabelDanger: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.notAttending,
  },
  cancelButton: {
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  cancelLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.meeting.strongText,
  },
});
