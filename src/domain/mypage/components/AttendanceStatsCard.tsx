import { StyleSheet, Text, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type AttendanceStatsCardProps = {
  groupCount: number;
  monthlyAttendCount: number;
  averageAttendanceRate: number;
};

export function AttendanceStatsCard({
  groupCount,
  monthlyAttendCount,
  averageAttendanceRate,
}: AttendanceStatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.stat}>
        <Text style={styles.value}>{groupCount}</Text>
        <Text style={styles.label}>참여 모임</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text style={styles.value}>{monthlyAttendCount}</Text>
        <Text style={styles.label}>이번달 참석</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text style={[styles.value, styles.valueHighlight]}>
          {Math.round(averageAttendanceRate * 100)}%
        </Text>
        <Text style={styles.label}>평균 참석률</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 76,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    // Figma 실제 값: 0px 2px 5px rgba(26,26,26,0.06)
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  value: {
    ...typography.heading3,
    fontSize: 22,
    color: colors.textStrong,
  },
  valueHighlight: {
    color: colors.attendanceHigh,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.hairline,
  },
});
