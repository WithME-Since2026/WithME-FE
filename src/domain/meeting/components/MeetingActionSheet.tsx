import { useEffect, useRef, useState } from 'react';

import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 220;

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
  // Modal 기본 slide 애니메이션은 배경(오버레이)까지 시트와 함께 밀려 올라오는 문제가 있어,
  // 배경은 즉시 나타나게(fade) 하고 시트만 아래에서 올라오도록(translateY) 따로 애니메이션함
  const [isMounted, setIsMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SCREEN_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setIsMounted(false));
    }
  }, [visible, backdropOpacity, sheetTranslateY]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents={visible ? 'auto' : 'none'}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderRadius: 20,
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
