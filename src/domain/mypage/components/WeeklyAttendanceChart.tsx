import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { WeeklyAttendanceResponse } from '@/domain/mypage/types';

type WeeklyAttendanceChartProps = {
  averageAttendanceRate: number;
  weeks: WeeklyAttendanceResponse[];
};

const BAR_HEIGHT = 52;

function getBarColor(attendanceRate: number) {
  if (attendanceRate >= 0.9) {
    return colors.attendanceHigh;
  }
  if (attendanceRate > 0.2) {
    return colors.attendanceMid;
  }
  return colors.hairline;
}

export function WeeklyAttendanceChart({
  averageAttendanceRate,
  weeks,
}: WeeklyAttendanceChartProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>최근 6주 참석</Text>
        <Text style={styles.average}>평균 {Math.round(averageAttendanceRate * 100)}%</Text>
      </View>

      <View style={styles.barRow}>
        {weeks.map((week) => (
          <View key={week.weekLabel} style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  height: BAR_HEIGHT * Math.max(week.attendanceRate, 0.08),
                  backgroundColor: getBarColor(week.attendanceRate),
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  average: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.attendanceHigh,
  },
  barRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  barTrack: {
    width: 36,
    height: BAR_HEIGHT,
    borderRadius: borderRadius.md,
    backgroundColor: colors.attendanceTrack,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: borderRadius.md,
  },
});
