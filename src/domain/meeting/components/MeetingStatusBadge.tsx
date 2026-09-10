import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MeetingStatusLabel } from '@/domain/meeting/types';

export function getMeetingStatusColors(label: MeetingStatusLabel) {
  switch (label) {
    case '진행':
      return {
        text: colors.meeting.statusInProgressText,
        background: colors.meeting.statusInProgressBackground,
        accent: colors.meeting.statusInProgressText,
      };
    case '완료':
      // 완료 배지는 중립 회색이지만, 리스트 아이템의 좌측 강조선은 그대로 초록색을 유지함
      return {
        text: colors.meeting.statusDoneText,
        background: colors.meeting.statusDoneBackground,
        accent: colors.meeting.statusAttendingBorder,
      };
    case '참석':
      return {
        text: colors.meeting.statusAttendingText,
        background: colors.meeting.statusAttendingBackground,
        accent: colors.meeting.statusAttendingBorder,
      };
    case '대기':
      return {
        text: colors.meeting.statusWaitingText,
        background: colors.meeting.statusWaitingBackground,
        accent: colors.meeting.statusWaitingText,
      };
  }
}

type MeetingStatusBadgeProps = {
  label: MeetingStatusLabel;
};

export function MeetingStatusBadge({ label }: MeetingStatusBadgeProps) {
  const { text, background } = getMeetingStatusColors(label);

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
});
