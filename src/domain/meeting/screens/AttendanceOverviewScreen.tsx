import { useState } from 'react';

import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/common/api/apiError';
import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';
import { AttendanceOverviewMemberRow } from '@/domain/meeting/components/AttendanceOverviewMemberRow';
import { AttendanceOverviewSummary } from '@/domain/meeting/components/AttendanceOverviewSummary';
import { useAttendanceOverviewQuery } from '@/domain/meeting/hooks/useAttendanceOverviewQuery';
import type { AttendanceOverviewStatus, MeetingAttendanceSummary } from '@/domain/meeting/types';

type AttendanceOverviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AttendanceOverview'
>;

const TABS: { status: AttendanceOverviewStatus; label: string }[] = [
  { status: 'PENDING', label: '미응답' },
  { status: 'ATTENDING', label: '참석' },
  { status: 'NOT_ATTENDING', label: '불참' },
];

export function AttendanceOverviewScreen({ route, navigation }: AttendanceOverviewScreenProps) {
  const { data, isLoading, isError, error } = useAttendanceOverviewQuery(route.params.meetingId);
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceOverviewStatus>('PENDING');
  const [isRoundMenuOpen, setIsRoundMenuOpen] = useState(false);

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError || !data) {
    return <ErrorView message={getApiErrorMessage(error, '참석 현황을 불러오지 못했습니다.')} />;
  }

  const round = data.rounds.find((item) => item.roundId === selectedRoundId) ?? data.rounds[0];
  if (!round) {
    return <EmptyView message="등록된 회차가 없습니다." />;
  }

  const attendance: MeetingAttendanceSummary = {
    attending: round.members.filter((member) => member.status === 'ATTENDING').length,
    notAttending: round.members.filter((member) => member.status === 'NOT_ATTENDING').length,
    pending: round.members.filter((member) => member.status === 'PENDING').length,
  };
  const counts: Record<AttendanceOverviewStatus, number> = {
    PENDING: attendance.pending,
    ATTENDING: attendance.attending,
    NOT_ATTENDING: attendance.notAttending,
  };
  const members = round.members.filter((member) => member.status === selectedStatus);
  const actionLabel = selectedStatus === 'ATTENDING' ? '재확인 리마인드' : '일괄 리마인드';

  const handleReminderPress = () => {
    Alert.alert('리마인드 발송', '리마인드 API가 연결되면 발송할 수 있습니다.');
  };

  const handleSharePress = () => {
    Alert.alert('카카오 공유', '카카오 공유 기능이 연결되면 사용할 수 있습니다.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>실시간 참석 현황</Text>
        <Pressable
          style={styles.roundSelector}
          onPress={() => setIsRoundMenuOpen(!isRoundMenuOpen)}
        >
          <Text style={styles.roundLabel}>{round.label}</Text>
          <Ionicons
            name={isRoundMenuOpen ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={colors.text.primary}
          />
        </Pressable>
      </View>

      {isRoundMenuOpen && (
        <View style={styles.roundMenu}>
          {data.rounds.map((item) => (
            <Pressable
              key={item.roundId}
              style={styles.roundOption}
              onPress={() => {
                setSelectedRoundId(item.roundId);
                setIsRoundMenuOpen(false);
              }}
            >
              <Text style={styles.roundLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={members}
        keyExtractor={(member) => String(member.memberId)}
        renderItem={({ item }) => (
          <AttendanceOverviewMemberRow
            member={item}
            isClosed={round.isClosed}
            onRemindPress={handleReminderPress}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.overview}>
              <Text style={styles.meetingTitle}>{route.params.title ?? data.title}</Text>
              <Text style={styles.dateText}>{round.dateText}</Text>
              <AttendanceOverviewSummary attendance={attendance} />
              <View style={styles.liveRow}>
                <View style={[styles.liveDot, round.isClosed && styles.closedDot]} />
                <Text style={[styles.liveLabel, round.isClosed && styles.closedLabel]}>
                  {round.isClosed ? '종료' : '실시간'}
                </Text>
              </View>
            </View>
            <View style={styles.tabs}>
              {TABS.map((tab) => (
                <Pressable
                  key={tab.status}
                  style={styles.tab}
                  onPress={() => setSelectedStatus(tab.status)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: selectedStatus === tab.status }}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      selectedStatus === tab.status && styles.tabLabelActive,
                    ]}
                  >
                    {tab.label} {counts[tab.status]}
                  </Text>
                  {selectedStatus === tab.status && <View style={styles.tabUnderline} />}
                </Pressable>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={<EmptyView message="해당하는 멤버가 없습니다." />}
        contentContainerStyle={styles.listContent}
      />

      {!round.isClosed && selectedStatus !== 'NOT_ATTENDING' && (
        <View style={styles.footer}>
          <Pressable style={styles.bulkButton} onPress={handleReminderPress}>
            <Text style={styles.bulkButtonLabel}>
              {TABS.find((tab) => tab.status === selectedStatus)?.label} {counts[selectedStatus]}명{' '}
              {actionLabel} →
            </Text>
          </Pressable>
          <Pressable
            style={styles.kakaoButton}
            onPress={handleSharePress}
            accessibilityLabel="카카오 공유"
          >
            <KakaoIcon size={28} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.meeting.overviewBackground },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    gap: spacing.sm,
  },
  headerTitle: { ...typography.heading3, fontWeight: '700', flex: 1, color: colors.text.primary },
  roundSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 30,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  roundLabel: { ...typography.caption, color: colors.text.primary },
  roundMenu: {
    position: 'absolute',
    top: 80,
    right: spacing.gutter,
    zIndex: 10,
    minWidth: 86,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    elevation: 4,
  },
  roundOption: { minHeight: 36, justifyContent: 'center', paddingHorizontal: spacing.sm },
  overview: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  meetingTitle: { ...typography.heading2, fontSize: 20, color: colors.text.primary },
  dateText: {
    ...typography.caption,
    color: colors.attendanceStatus.pending,
    marginTop: spacing.xs,
    marginBottom: spacing.gutter,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.attendanceStatus.attending,
  },
  closedDot: { backgroundColor: colors.attendanceStatus.pending },
  liveLabel: { ...typography.caption, fontWeight: '700', color: colors.attendanceStatus.attending },
  closedLabel: { color: colors.attendanceStatus.pending },
  tabs: {
    height: 46,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { ...typography.body2, color: colors.attendanceStatus.pending },
  tabLabelActive: { color: colors.meeting.primary, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: spacing.gutter,
    right: spacing.gutter,
    height: 2,
    backgroundColor: colors.meeting.primary,
  },
  listContent: { flexGrow: 1, paddingBottom: spacing.md },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.gutter,
    paddingTop: spacing.sm,
  },
  bulkButton: {
    flex: 1,
    height: 54,
    borderRadius: borderRadius.card,
    backgroundColor: colors.meeting.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  bulkButtonLabel: { ...typography.body2, fontWeight: '700', color: colors.background },
  kakaoButton: {
    width: 63,
    height: 54,
    borderRadius: borderRadius.card,
    backgroundColor: colors.kakao,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
