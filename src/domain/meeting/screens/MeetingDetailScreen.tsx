import { useState } from 'react';

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { AttendanceChoiceButtons } from '@/domain/meeting/components/AttendanceChoiceButtons';
import { AttendanceCountBadges } from '@/domain/meeting/components/AttendanceCountBadges';
import { AttendanceProgressBar } from '@/domain/meeting/components/AttendanceProgressBar';
import { AttendanceRadialProgress } from '@/domain/meeting/components/AttendanceRadialProgress';
import { LeaveMeetingConfirmDialog } from '@/domain/meeting/components/LeaveMeetingConfirmDialog';
import { MeetingActionSheet } from '@/domain/meeting/components/MeetingActionSheet';
import { MeetingDetailInfoCard } from '@/domain/meeting/components/MeetingDetailInfoCard';
import { MemberListCard } from '@/domain/meeting/components/MemberListCard';
import { useMeetingDetailQuery } from '@/domain/meeting/hooks/useMeetingDetailQuery';
import type { MeetingAttendanceSummary, MyAttendanceStatus } from '@/domain/meeting/types';

// 일정 변경, 모임 정보 수정, 알림 설정, 모임 삭제, 리마인더 발송, 전체보기는
// 아직 목적 화면이 없어 별도 이슈에서 연결 예정
function handlePendingAction() {}

const ATTENDANCE_KEY_BY_STATUS: Record<MyAttendanceStatus, keyof MeetingAttendanceSummary> = {
  ATTENDING: 'attending',
  NOT_ATTENDING: 'notAttending',
  UNDECIDED: 'pending',
};

// 참여자가 참석 여부를 바꾸면 원래 응답 수를 빼고 새 응답 수를 더해 현황에 바로 반영
function applyMyAttendanceAdjustment(
  attendance: MeetingAttendanceSummary,
  originalStatus: MyAttendanceStatus | null,
  nextStatus: MyAttendanceStatus,
): MeetingAttendanceSummary {
  const originalKey = originalStatus ? ATTENDANCE_KEY_BY_STATUS[originalStatus] : 'pending';
  const nextKey = ATTENDANCE_KEY_BY_STATUS[nextStatus];

  return {
    ...attendance,
    [originalKey]: attendance[originalKey] - 1,
    [nextKey]: attendance[nextKey] + 1,
  };
}

type MeetingDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'MeetingDetail'>;

export function MeetingDetailScreen({ route, navigation }: MeetingDetailScreenProps) {
  const { meetingId } = route.params;
  const {
    data: meeting,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMeetingDetailQuery(meetingId);
  const [myAttendanceStatus, setMyAttendanceStatus] = useState<MyAttendanceStatus | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRequestLeave = () => {
    setIsActionSheetOpen(false);
    setIsLeaveConfirmOpen(true);
  };

  const handleConfirmLeave = () => {
    setIsLeaveConfirmOpen(false);
    // TODO: 모임 나가기 API 확정 후 연결. 지금은 홈으로 돌아가는 것으로 대체
    navigation.navigate('Main');
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError || !meeting) {
    return <ErrorView message="모임 정보를 불러오지 못했습니다." />;
  }

  const isOperator = meeting.role === 'OPERATOR';
  const currentAttendanceStatus = myAttendanceStatus ?? meeting.myAttendanceStatus;
  const displayedAttendance =
    myAttendanceStatus && myAttendanceStatus !== meeting.myAttendanceStatus
      ? applyMyAttendanceAdjustment(meeting.attendance, meeting.myAttendanceStatus, myAttendanceStatus)
      : meeting.attendance;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {meeting.title}
        </Text>

        <Pressable onPress={() => setIsActionSheetOpen(true)} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.meeting.primary} />
        }
      >
        <MeetingDetailInfoCard
          roundLabel={meeting.roundLabel}
          memberCountLabel={`참석 멤버 ${meeting.totalMemberCount}명`}
          dateText={meeting.dateText}
          locationText={meeting.locationText}
          timeText={meeting.timeText}
        />

        {isOperator ? (
          <>
            <View style={styles.card}>
              <View style={styles.attendanceOverviewRow}>
                <AttendanceRadialProgress
                  attendance={meeting.attendance}
                  totalMemberCount={meeting.totalMemberCount}
                />

                <AttendanceCountBadges
                  attendance={meeting.attendance}
                  formatLabel={(count, label) => `${label} ${count}`}
                  direction="column"
                />
              </View>
            </View>

            <Pressable style={styles.reminderButton} onPress={handlePendingAction}>
              <Ionicons name="notifications" size={14} color={colors.meeting.mutedText} />
              <Text style={styles.reminderButtonLabel}>리마인더 발송</Text>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>참석 멤버</Text>
              <Pressable onPress={handlePendingAction} hitSlop={8}>
                <Text style={styles.sectionLink}>전체보기 →</Text>
              </Pressable>
            </View>

            <MemberListCard attendees={meeting.attendees} />

            <Pressable
              style={[styles.footerButton, styles.footerButtonSpaced]}
              onPress={handlePendingAction}
            >
              <Text style={styles.footerButtonLabel}>일정 변경 요청</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>참석 여부를 선택해주세요</Text>
              <AttendanceChoiceButtons
                value={currentAttendanceStatus}
                onChange={setMyAttendanceStatus}
              />

              <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>현재 참석 현황</Text>
              <AttendanceProgressBar attendance={displayedAttendance} />

              <AttendanceCountBadges
                attendance={displayedAttendance}
                formatLabel={(count, label) => `${count}명 ${label}`}
              />
            </View>

            <Text style={styles.sectionTitle}>참석 멤버</Text>
            <MemberListCard attendees={meeting.attendees} />
          </>
        )}
      </ScrollView>

      <MeetingActionSheet
        visible={isActionSheetOpen}
        title={meeting.title}
        isOperator={isOperator}
        onClose={() => setIsActionSheetOpen(false)}
        onReschedule={handlePendingAction}
        onEditInfo={handlePendingAction}
        onNotificationSettings={handlePendingAction}
        onLeave={handleRequestLeave}
        onDelete={handlePendingAction}
      />

      <LeaveMeetingConfirmDialog
        visible={isLeaveConfirmOpen}
        onCancel={() => setIsLeaveConfirmOpen(false)}
        onConfirm={handleConfirmLeave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg + 8,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  attendanceOverviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  reminderButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.meeting.outlineBorder,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  reminderButtonLabel: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.meeting.mutedText,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.body2,
    fontWeight: '700',
    color: colors.meeting.strongText,
  },
  sectionTitleSpaced: {
    marginTop: spacing.xs,
  },
  sectionLink: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.meeting.primary,
  },
  footerButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.meeting.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonSpaced: {
    marginTop: spacing.md,
  },
  footerButtonLabel: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.background,
  },
});
