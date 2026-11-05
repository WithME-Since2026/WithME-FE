import { StyleSheet, Text, View } from 'react-native';

import { Circle, Svg } from 'react-native-svg';

import { colors, spacing, typography } from '@/common/styles/theme';

import type { MeetingAttendanceSummary } from '@/domain/meeting/types';

type AttendanceOverviewSummaryProps = {
  attendance: MeetingAttendanceSummary;
};

const SIZE = 90;
const STROKE_WIDTH = 13;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AttendanceOverviewSummary({ attendance }: AttendanceOverviewSummaryProps) {
  const total = attendance.attending + attendance.notAttending + attendance.pending;
  const attendingLength = total > 0 ? (attendance.attending / total) * CIRCUMFERENCE : 0;
  const notAttendingLength = total > 0 ? (attendance.notAttending / total) * CIRCUMFERENCE : 0;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={45}
            cy={45}
            r={RADIUS}
            stroke={colors.attendanceStatus.progressPending}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={45}
            cy={45}
            r={RADIUS}
            stroke={colors.attendanceStatus.attending}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${attendingLength} ${CIRCUMFERENCE - attendingLength}`}
            rotation={-90}
            origin="45, 45"
          />
          <Circle
            cx={45}
            cy={45}
            r={RADIUS}
            stroke={colors.attendanceStatus.notAttending}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${notAttendingLength} ${CIRCUMFERENCE - notAttendingLength}`}
            strokeDashoffset={-attendingLength}
            rotation={-90}
            origin="45, 45"
          />
        </Svg>
        <View style={styles.center}>
          <Text style={styles.total}>{total}</Text>
          <Text style={styles.totalLabel}>전체</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <LegendRow
          color={colors.attendanceStatus.attending}
          label="참석"
          count={attendance.attending}
        />
        <LegendRow
          color={colors.attendanceStatus.notAttending}
          label="불참"
          count={attendance.notAttending}
        />
        <LegendRow
          color={colors.attendanceStatus.progressPending}
          label="미응답"
          count={attendance.pending}
        />
      </View>
    </View>
  );
}

type LegendRowProps = {
  color: string;
  label: string;
  count: number;
};

function LegendRow({ color, label, count }: LegendRowProps) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendCount}>{count}명</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.gutter },
  chart: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center' },
  total: { ...typography.heading2, color: colors.text.primary },
  totalLabel: { ...typography.caption, fontSize: 10, color: colors.attendanceStatus.pending },
  legend: { gap: spacing.xs + 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { ...typography.captionLarge, color: colors.attendanceStatus.pending, minWidth: 38 },
  legendCount: { ...typography.captionLarge, fontWeight: '700', color: colors.text.primary },
});
