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
  const { role, title, scheduleText, locationText, dDayLabel, attendance } = meeting;
  const isOperator = role === 'OPERATOR';
  const totalAttendance = attendance.attending + attendance.notAttending + attendance.pending;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: isOperator ? colors.meeting.operatorBadge : colors.meeting.participantBadge },
          ]}
        >
          <Text style={styles.roleBadgeLabel}>{isOperator ? '운영자' : '참여자'}</Text>
        </View>

        <View style={styles.dDayBadge}>
          <Text style={styles.dDayLabel}>{dDayLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{scheduleText}</Text>
      <Text style={styles.meta}>{locationText}</Text>

      <View style={styles.progressTrack}>
        {attendance.attending > 0 && (
          <View style={{ flex: attendance.attending, backgroundColor: colors.meeting.attending }} />
        )}
        {attendance.notAttending > 0 && (
          <View
            style={{ flex: attendance.notAttending, backgroundColor: colors.meeting.notAttending }}
          />
        )}
        {(attendance.pending > 0 || totalAttendance === 0) && (
          <View style={{ flex: attendance.pending || 1, backgroundColor: colors.meeting.pending }} />
        )}
      </View>

      <Text style={styles.summaryText}>
        <Text style={{ color: colors.meeting.attending }}>참석 {attendance.attending}</Text>
        <Text style={{ color: colors.meeting.pending }}> · </Text>
        <Text style={{ color: colors.meeting.notAttending }}>불참 {attendance.notAttending}</Text>
        <Text style={{ color: colors.meeting.pending }}> · 미응답 {attendance.pending}</Text>
      </Text>

      {isOperator ? (
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.actionButtonPrimary]} onPress={onViewStatusPress}>
            <Text style={styles.actionLabelPrimary}>현황 보기</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={onRemindPress}>
            <Text style={styles.actionLabelOutline}>리마인더</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionButton, styles.actionButtonPrimary]} onPress={onAttendPress}>
            <Text style={styles.actionLabelPrimary}>참석하기</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonDark]} onPress={onDeclinePress}>
            <Text style={styles.actionLabelPrimary}>불참하기</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={onUndecidedPress}>
            <Text style={styles.actionLabelMuted}>미정</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.meeting.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  roleBadgeLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.background,
  },
  dDayBadge: {
    backgroundColor: colors.meeting.dDayBackground,
    borderWidth: 1,
    borderColor: colors.meeting.dDayBorder,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  dDayLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.background,
  },
  title: {
    ...typography.heading3,
    color: colors.background,
    marginTop: spacing.sm,
  },
  meta: {
    ...typography.caption,
    color: colors.meeting.mutedText,
    marginTop: 2,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 7,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.meeting.cardDivider,
    marginTop: spacing.md,
  },
  summaryText: {
    ...typography.caption,
    fontSize: 9,
    marginTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonDark: {
    backgroundColor: colors.meeting.cardDivider,
    borderWidth: 1.5,
    borderColor: colors.meeting.dDayBorder,
  },
  actionButtonOutline: {
    borderWidth: 1.5,
    borderColor: colors.meeting.dDayBorder,
  },
  actionLabelPrimary: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.background,
  },
  actionLabelOutline: {
    ...typography.body2,
    color: colors.background,
  },
  actionLabelMuted: {
    ...typography.body2,
    color: colors.meeting.mutedText,
  },
});
