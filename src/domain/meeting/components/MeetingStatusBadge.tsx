import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MeetingStatusLabel } from '@/domain/meeting/types';

export function getMeetingStatusColors(label: MeetingStatusLabel) {
  switch (label) {
    case '진행':
      return { text: colors.meeting.inProgress, background: colors.meeting.inProgressBackground };
    case '완료':
    case '참석':
      return { text: colors.meeting.attending, background: colors.meeting.attendingBackground };
    case '대기':
      return { text: colors.meeting.waiting, background: colors.meeting.waitingBackground };
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
