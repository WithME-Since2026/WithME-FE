import { useRef, useState } from 'react';

import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyView } from '@/common/components/EmptyView';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { MainTabParamList, RootStackParamList } from '@/app/navigation';

import { FeaturedMeetingCard } from '@/domain/meeting/components/FeaturedMeetingCard';
import { MeetingListItem } from '@/domain/meeting/components/MeetingListItem';
import type { MeetingRoleFilter } from '@/domain/meeting/components/MeetingRoleFilterTabs';
import { MeetingRoleFilterTabs } from '@/domain/meeting/components/MeetingRoleFilterTabs';
import { useHomeMeetingsQuery } from '@/domain/meeting/hooks/useHomeMeetingsQuery';

const ROLE_FILTER_LABELS: { value: MeetingRoleFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'OPERATOR', label: '운영' },
  { value: 'PARTICIPANT', label: '참여' },
];

// 리마인더 발송/참석 응답은 모임 상세 화면에서 처리하므로 홈 카드에서는 추후 이슈에서 연결 예정
function handlePendingAction() {}

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { data, isLoading, isError } = useHomeMeetingsQuery();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [roleFilter, setRoleFilter] = useState<MeetingRoleFilter>('ALL');

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError || !data) {
    return <ErrorView message="홈 정보를 불러오지 못했습니다." />;
  }

  const { featuredMeetings, otherMeetings } = data;

  const allCount = featuredMeetings.length + otherMeetings.length;
  const operatorCount = [...featuredMeetings, ...otherMeetings].filter(
    (meeting) => meeting.role === 'OPERATOR',
  ).length;
  const participantCount = allCount - operatorCount;

  const roleFilterCounts: Record<MeetingRoleFilter, number> = {
    ALL: allCount,
    OPERATOR: operatorCount,
    PARTICIPANT: participantCount,
  };

  const filteredOtherMeetings = otherMeetings.filter(
    (meeting) => roleFilter === 'ALL' || meeting.role === roleFilter,
  );

  const handleFeaturedScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveFeaturedIndex(index);
  };

  const handleViewMeetingDetail = (meetingId: number) => {
    navigation.navigate('MeetingDetail', { meetingId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 모임</Text>

          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} hitSlop={8}>
              <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
              <View style={styles.notificationDot} />
            </Pressable>

            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={colors.text.secondary} />
            </View>
          </View>
        </View>

        {featuredMeetings.length === 0 ? (
          <EmptyView message="예정된 모임이 없습니다." />
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleFeaturedScrollEnd}
            >
              {featuredMeetings.map((meeting) => (
                <View key={meeting.meetingId} style={[styles.featuredPage, { width }]}>
                  <FeaturedMeetingCard
                    meeting={meeting}
                    onViewStatusPress={() => handleViewMeetingDetail(meeting.meetingId)}
                    onRemindPress={handlePendingAction}
                    onAttendPress={handlePendingAction}
                    onDeclinePress={handlePendingAction}
                    onUndecidedPress={handlePendingAction}
                  />
                </View>
              ))}
            </ScrollView>

            {featuredMeetings.length > 1 && (
              <View style={styles.dots}>
                {featuredMeetings.map((meeting, index) => (
                  <View
                    key={meeting.meetingId}
                    style={[styles.dot, index === activeFeaturedIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <View style={styles.filterSection}>
          <MeetingRoleFilterTabs
            tabs={ROLE_FILTER_LABELS.map((tab) => ({
              ...tab,
              count: roleFilterCounts[tab.value],
            }))}
            value={roleFilter}
            onChange={setRoleFilter}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>그 외 모임 · {filteredOtherMeetings.length}</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.sortLabel}>최근순 &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {filteredOtherMeetings.length === 0 ? (
            <EmptyView message="해당하는 모임이 없습니다." />
          ) : (
            filteredOtherMeetings.map((meeting) => (
              <MeetingListItem
                key={meeting.meetingId}
                meeting={meeting}
                onPress={() => handleViewMeetingDetail(meeting.meetingId)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        hitSlop={8}
        onPress={() => navigation.navigate('CreateMeeting')}
      >
        <Ionicons name="add" size={24} color={colors.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredPage: {
    paddingHorizontal: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.meeting.dotInactive,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.meeting.primary,
  },
  filterSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  listHeaderTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.meeting.mutedText,
  },
  sortLabel: {
    ...typography.caption,
    color: colors.meeting.primary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.meeting.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.meeting.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
});
