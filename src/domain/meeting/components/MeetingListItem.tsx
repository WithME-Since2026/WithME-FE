import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import {
  MeetingStatusBadge,
  getMeetingStatusColors,
} from '@/domain/meeting/components/MeetingStatusBadge';
import type { MeetingSummaryResponse } from '@/domain/meeting/types';

type MeetingListItemProps = {
  meeting: MeetingSummaryResponse;
  onPress?: () => void;
};

export function MeetingListItem({ meeting, onPress }: MeetingListItemProps) {
  const accentColor = getMeetingStatusColors(meeting.statusLabel).text;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      <View style={styles.info}>
        <Text style={styles.title}>{meeting.title}</Text>
        <Text style={styles.schedule}>{meeting.scheduleText}</Text>
      </View>

      <MeetingStatusBadge label={meeting.statusLabel} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.text.primary,
  },
  schedule: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
