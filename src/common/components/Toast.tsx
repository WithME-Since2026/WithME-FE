import { useEffect } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type ToastProps = {
  message: string;
  onDismiss: () => void;
  // 자동으로 사라지기까지 걸리는 시간(ms)
  duration?: number;
};

// 액션 완료를 알려주는 화면 하단 토스트 배너 (예: 알림 화면의 참가 신청 거절 피드백)
export function Toast({ message, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Text style={styles.dismissLabel}>닫기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.toastBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  message: {
    ...typography.body2,
    color: colors.background,
    flexShrink: 1,
  },
  dismissLabel: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.notifJoinBg,
    marginLeft: spacing.md,
  },
});
