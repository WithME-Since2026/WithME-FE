import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type MeetingDetailInfoCardProps = {
  roundLabel: string;
  memberCountLabel?: string;
  dateText: string;
  locationText: string;
  timeText: string;
};

export function MeetingDetailInfoCard({
  roundLabel,
  memberCountLabel,
  dateText,
  locationText,
  timeText,
}: MeetingDetailInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.roundLabel}>{roundLabel}</Text>
        {memberCountLabel && <Text style={styles.memberCountLabel}>{memberCountLabel}</Text>}
      </View>

      <Text style={styles.metaRow}>📅  {dateText}</Text>
      <Text style={styles.metaRow}>📍  {locationText}</Text>
      <Text style={styles.metaRow}>🕐  {timeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  roundLabel: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  memberCountLabel: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
  metaRow: {
    ...typography.body2,
    color: colors.text.primary,
  },
});
