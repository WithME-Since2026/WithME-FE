import { StyleSheet, View } from 'react-native';

import { borderRadius, colors } from '@/common/styles/theme';

import type { MeetingAttendanceSummary } from '@/domain/meeting/types';

type AttendanceProgressBarProps = {
  attendance: MeetingAttendanceSummary;
};

export function AttendanceProgressBar({ attendance }: AttendanceProgressBarProps) {
  const total = attendance.attending + attendance.notAttending + attendance.pending;

  return (
    <View style={styles.track}>
      {attendance.attending > 0 && (
        <View style={{ flex: attendance.attending, backgroundColor: colors.attendanceStatus.attending }} />
      )}
      {attendance.notAttending > 0 && (
        <View
          style={{
            flex: attendance.notAttending,
            backgroundColor: colors.attendanceStatus.notAttending,
          }}
        />
      )}
      {(attendance.pending > 0 || total === 0) && (
        <View
          style={{
            flex: attendance.pending || 1,
            backgroundColor: colors.attendanceStatus.progressPending,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 10,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.attendanceStatus.pendingBackground,
  },
});
