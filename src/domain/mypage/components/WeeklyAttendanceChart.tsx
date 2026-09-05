import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/common/styles/theme';

import type { WeeklyAttendanceResponse } from '@/domain/mypage/types';

type WeeklyAttendanceChartProps = {
  averageAttendanceRate: number;
  weeks: WeeklyAttendanceResponse[];
};

// Figma 실제 값: 막대 최대 높이 52px, 바 트랙(빈 배경 박스) 없이 막대 자체만 하단 정렬로 떠 있는 형태
const BAR_HEIGHT = 52;
const MIN_BAR_HEIGHT = 8;

// Figma 실제 값 기준 구간(막대 높이 21/52/31/52/8/47px → 참석률 약 0.40/1.0/0.60/1.0/0.15/0.90)에 맞춘 3단계 색상 경계
function getBarColor(attendanceRate: number) {
  if (attendanceRate >= 0.9) {
    return colors.weeklyChartHigh;
  }
  if (attendanceRate >= 0.5) {
    return colors.weeklyChartMid;
  }
  return colors.weeklyChartLow;
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
          <View
            key={week.weekLabel}
            style={[
              styles.bar,
              {
                height: Math.max(BAR_HEIGHT * week.attendanceRate, MIN_BAR_HEIGHT),
                backgroundColor: getBarColor(week.attendanceRate),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.labelRow}>
        {weeks.map((week) => (
          <Text
            key={week.weekLabel}
            style={[styles.weekLabel, week.weekLabel === '이번주' && styles.weekLabelCurrent]}
          >
            {week.weekLabel}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: colors.background,
    padding: spacing.md,
    // Figma 실제 값: 0px 1px 1px rgba(0,0,0,0.08)
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '500',
    color: colors.notifReadText,
  },
  average: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '700',
    color: colors.weeklyChartHigh,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: BAR_HEIGHT + 22,
    paddingTop: 14,
  },
  bar: {
    flex: 1,
    borderRadius: 6,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: spacing.sm,
  },
  weekLabel: {
    flex: 1,
    fontSize: 9,
    lineHeight: 13.5,
    color: colors.notifReadText,
    textAlign: 'center',
  },
  weekLabelCurrent: {
    fontWeight: '500',
    color: colors.weeklyChartHigh,
  },
});
