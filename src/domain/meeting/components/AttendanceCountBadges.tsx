import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MeetingAttendanceSummary } from '@/domain/meeting/types';

type AttendanceCountBadgesProps = {
  attendance: MeetingAttendanceSummary;
  // 운영자 뷰는 "참석 5", 참여자 뷰는 "5명 참석" 형식으로 라벨 순서가 달라 포맷터를 주입받음
  formatLabel: (count: number, label: string) => string;
  direction?: 'row' | 'column';
};

export function AttendanceCountBadges({
  attendance,
  formatLabel,
  direction = 'row',
}: AttendanceCountBadgesProps) {
  const isColumn = direction === 'column';
  const badgeStyle = [styles.badge, isColumn && styles.badgeColumn];

  return (
    <View style={[styles.row, isColumn && styles.column]}>
      <View style={[...badgeStyle, { backgroundColor: colors.attendanceStatus.attendingBackground }]}>
        <Text style={[styles.label, { color: colors.attendanceStatus.attending }]}>
          {formatLabel(attendance.attending, '참석')}
        </Text>
      </View>
      <View style={[...badgeStyle, { backgroundColor: colors.attendanceStatus.notAttendingBackground }]}>
        <Text style={[styles.label, { color: colors.attendanceStatus.notAttending }]}>
          {formatLabel(attendance.notAttending, '불참')}
        </Text>
      </View>
      <View style={[...badgeStyle, { backgroundColor: colors.attendanceStatus.pendingBackground }]}>
        <Text style={[styles.label, { color: colors.attendanceStatus.pending }]}>
          {formatLabel(attendance.pending, '미응답')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flexDirection: 'column',
  },
  badge: {
    flex: 1,
    height: 30,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeColumn: {
    flex: 0,
    alignSelf: 'stretch',
    width: 90,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
});
