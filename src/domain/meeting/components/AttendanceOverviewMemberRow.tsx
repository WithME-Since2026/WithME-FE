import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { AttendanceOverviewMemberResponse } from '@/domain/meeting/types';

type AttendanceOverviewMemberRowProps = {
  member: AttendanceOverviewMemberResponse;
  isClosed: boolean;
  onRemindPress: (memberId: number) => void;
};

export function AttendanceOverviewMemberRow({
  member,
  isClosed,
  onRemindPress,
}: AttendanceOverviewMemberRowProps) {
  const isPending = member.status === 'PENDING';
  const isAttending = member.status === 'ATTENDING';

  let detail = member.absenceReason ? `“${member.absenceReason}”` : '사유 없음';
  if (isPending) {
    detail = '응답 없음';
  }
  if (isAttending) {
    detail = '';
  }

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>{member.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        {!!detail && <Text style={styles.detail}>{detail}</Text>}
      </View>
      {isPending && !isClosed && (
        <Pressable style={styles.remindButton} onPress={() => onRemindPress(member.memberId)}>
          <Text style={styles.remindLabel}>리마인드</Text>
        </Pressable>
      )}
      {isAttending && <Text style={styles.attendingLabel}>참석 ✓</Text>}
      {!isPending && !isAttending && <Text style={styles.absentLabel}>불참 ×</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md - 4,
  },
  initial: {
    ...typography.captionLarge,
    fontWeight: '700',
    color: colors.attendanceStatus.pending,
  },
  info: { flex: 1 },
  name: { ...typography.body2, fontWeight: '600', color: colors.text.primary },
  detail: { ...typography.caption, color: colors.attendanceStatus.pending },
  remindButton: {
    width: 72,
    height: 32,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remindLabel: { fontSize: 11, color: colors.text.primary },
  attendingLabel: { ...typography.body2, color: colors.attendanceStatus.attending },
  absentLabel: { ...typography.body2, color: colors.attendanceStatus.notAttending },
});
