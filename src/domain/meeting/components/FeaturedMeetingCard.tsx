import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { FeaturedMeetingResponse } from '@/domain/meeting/types';

type FeaturedMeetingCardProps = {
  meeting: FeaturedMeetingResponse;
  onViewStatusPress?: () => void;
  onRemindPress?: () => void;
  onAttendPress?: () => void;
  onDeclinePress?: () => void;
  onUndecidedPress?: () => void;
};

export function FeaturedMeetingCard({
  meeting,
  onViewStatusPress,
  onRemindPress,
  onAttendPress,
  onDeclinePress,
  onUndecidedPress,
}: FeaturedMeetingCardProps) {
  const { role, roundLabel, title, dateLabel, timeLabel, locationText, dDayLabel, attendance } =
    meeting;
  const isOperator = role === 'OPERATOR';

  return (
    <View style={[styles.card, !isOperator && styles.cardParticipant]}>
      <View style={styles.topRow}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeLabel}>
            {isOperator ? '운영자' : '참여자'} · {roundLabel}
          </Text>
        </View>

        <Text style={styles.dDayLabel}>{dDayLabel}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {dateLabel} {timeLabel} · {locationText}
      </Text>

      <View style={styles.progressTrack}>
        <View style={{ flex: attendance.attending, backgroundColor: colors.meeting.primary }} />
        <View style={{ flex: attendance.notAttending, backgroundColor: colors.meeting.notAttending }} />
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          참석 <Text style={[styles.summaryValue, { color: colors.meeting.primary }]}>{attendance.attending}</Text>
        </Text>
        <Text style={styles.summaryText}>
          불참{' '}
          <Text style={[styles.summaryValue, { color: colors.meeting.notAttending }]}>
            {attendance.notAttending}
          </Text>
        </Text>
        <Text style={styles.summaryText}>
          미응답{' '}
          <Text style={[styles.summaryValue, { color: colors.meeting.pendingText }]}>
            {attendance.pending}
          </Text>
        </Text>
      </View>

      {isOperator ? (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.actionButtonPrimary, styles.actionButtonWide]}
            onPress={onViewStatusPress}
          >
            <Text style={styles.actionLabelPrimary}>현황 보기</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={onRemindPress}>
            <Text style={styles.actionLabelOutline}>리마인더</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.actionButtonPrimary, styles.actionButtonWide]}
            onPress={onAttendPress}
          >
            <Text style={styles.actionLabelPrimary}>참석</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={onUndecidedPress}>
            <Text style={styles.actionLabelOutline}>미정</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={onDeclinePress}>
            <Text style={styles.actionLabelOutline}>불참</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg + 8,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardParticipant: {
    borderWidth: 1,
    borderColor: colors.meeting.participantCardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: colors.meeting.badgeBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  roleBadgeLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  dDayLabel: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
  title: {
    ...typography.heading2,
    color: colors.meeting.strongText,
    marginTop: spacing.sm,
  },
  meta: {
    ...typography.body2,
    color: colors.meeting.mutedText,
    marginTop: spacing.xs,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.meeting.progressTrack,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  summaryText: {
    ...typography.caption,
    color: colors.meeting.mutedText,
  },
  summaryValue: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonWide: {
    flex: 2,
  },
  actionButtonPrimary: {
    backgroundColor: colors.meeting.primary,
  },
  actionButtonOutline: {
    borderWidth: 1,
    borderColor: colors.meeting.outlineBorder,
  },
  actionLabelPrimary: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.background,
  },
  actionLabelOutline: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.meeting.mutedText,
  },
});
