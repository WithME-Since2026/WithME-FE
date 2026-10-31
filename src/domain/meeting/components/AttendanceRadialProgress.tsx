import { StyleSheet, Text, View } from 'react-native';

import { Circle, Svg } from 'react-native-svg';

import { colors, typography } from '@/common/styles/theme';

import type { MeetingAttendanceSummary } from '@/domain/meeting/types';

type AttendanceRadialProgressProps = {
  attendance: MeetingAttendanceSummary;
  totalMemberCount: number;
  size?: number;
};

const STROKE_WIDTH = 12;

export function AttendanceRadialProgress({
  attendance,
  totalMemberCount,
  size = 128,
}: AttendanceRadialProgressProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const attendingLength =
    totalMemberCount > 0 ? (attendance.attending / totalMemberCount) * circumference : 0;
  const notAttendingLength =
    totalMemberCount > 0 ? (attendance.notAttending / totalMemberCount) * circumference : 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.meeting.progressTrack}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.meeting.primary}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${attendingLength} ${circumference - attendingLength}`}
          strokeLinecap="butt"
          fill="none"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.meeting.notAttending}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${notAttendingLength} ${circumference - notAttendingLength}`}
          strokeDashoffset={-attendingLength}
          strokeLinecap="butt"
          fill="none"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View style={styles.labelWrapper}>
        <Text style={styles.valueText}>
          {attendance.attending}/{totalMemberCount}
        </Text>
        <Text style={styles.captionText}>참석 응답</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  labelWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    ...typography.heading1,
    color: colors.meeting.strongText,
  },
  captionText: {
    ...typography.caption,
    color: colors.meeting.mutedText,
    marginTop: 2,
  },
});
