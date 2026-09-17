import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { WithdrawDataRow } from '@/domain/mypage/components/WithdrawDataRow';
import { WithdrawStepHeader } from '@/domain/mypage/components/WithdrawStepHeader';
import { useMyGroupsQuery } from '@/domain/mypage/hooks/useMyGroupsQuery';
import { useMyPageAttendanceQuery } from '@/domain/mypage/hooks/useMyPageAttendanceQuery';
import { useMyPageProfileQuery } from '@/domain/mypage/hooks/useMyPageProfileQuery';
import { useSubscriptionStore } from '@/domain/subscription/store/subscriptionStore';

type WithdrawScreenProps = NativeStackScreenProps<RootStackParamList, 'Withdraw'>;

// 회원 탈퇴 1/3: 탈퇴 시 사라지는 데이터를 안내하고, 탈퇴 대신 택할 수 있는 대안을 보여줌 (Figma node 879:20)
export function WithdrawScreen({ navigation }: WithdrawScreenProps) {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useMyPageProfileQuery();
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useMyPageAttendanceQuery();
  const { data: groups, isLoading: isGroupsLoading, isError: isGroupsError } = useMyGroupsQuery();
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  const isLoading = isProfileLoading || isAttendanceLoading || isGroupsLoading;
  const isError = isProfileError || isAttendanceError || isGroupsError;

  const handleNotificationOnlyPress = () => navigation.navigate('NotificationSettings');

  // TODO: 특정 모임만 나가는 화면이 아직 없어 우선 자리만 만들어 둠
  const handleGroupOnlyLeavePress = () => {};

  const handleNextPress = () => navigation.navigate('WithdrawReason');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <WithdrawStepHeader step={1} onBackPress={() => navigation.goBack()} />

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="회원 정보를 불러오지 못했습니다." />}

      {!isLoading && !isError && profile && attendance && groups && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>탈퇴하면 이 데이터가{'\n'}모두 삭제됩니다</Text>
            <Text style={styles.subtitle}>
              {profile.nickname} 님의 계정과 아래 기록이 사라집니다.
            </Text>
          </View>

          <View style={styles.dataCard}>
            <WithdrawDataRow
              icon="people-outline"
              label="참여 중인 모임"
              description="즉시 탈퇴 처리됩니다"
              value={`${groups.length}개`}
            />
            <WithdrawDataRow
              icon="stats-chart-outline"
              label="참석 기록·참석률"
              description="복구할 수 없습니다"
              value={`${attendance.monthlyAttendCount}건`}
            />
            <WithdrawDataRow
              icon="sparkles-outline"
              label="프리미엄 구독"
              description={isPremium ? '남은 기간은 환불되지 않습니다' : '가입 내역이 없습니다'}
              value={isPremium ? 'PRO' : '없음'}
            />
            <WithdrawDataRow
              icon="card-outline"
              label="등록된 결제 수단"
              description="카드 · 1234"
              value="삭제"
              showDivider={false}
            />
          </View>

          <View style={styles.alternativeSection}>
            <Text style={styles.alternativeTitle}>혹시 이게 필요한 건 아닐까요?</Text>

            <Pressable style={styles.alternativeCard} onPress={handleNotificationOnlyPress}>
              <View style={styles.alternativeTextGroup}>
                <Text style={styles.alternativeLabel}>알림만 끄기</Text>
                <Text style={styles.alternativeDescription}>
                  알림이 너무 많다면 계정은 유지하고 알림만 정리
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
            </Pressable>

            <Pressable style={styles.alternativeCard} onPress={handleGroupOnlyLeavePress}>
              <View style={styles.alternativeTextGroup}>
                <Text style={styles.alternativeLabel}>모임만 나가기</Text>
                <Text style={styles.alternativeDescription}>
                  특정 모임이 부담이라면 그 모임만 탈퇴
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
            </Pressable>
          </View>

          {/* Figma 디자인(879:20)에는 이 단계에 별도 CTA가 없어, 2/3·3/3과 동일한 스타일의 "다음" 버튼을 추가해 진행 가능하게 함 */}
          <Pressable style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonLabel}>다음</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading2,
    fontSize: 22,
    color: colors.textStrong,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  dataCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    // Figma 실제 값: 0px 2px 8px rgba(0,0,0,0.06)
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alternativeSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  alternativeTitle: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    // Figma 실제 값: 0px 2px 6px rgba(0,0,0,0.05)
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  alternativeTextGroup: {
    flex: 1,
  },
  alternativeLabel: {
    ...typography.body2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  alternativeDescription: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  nextButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  nextButtonLabel: {
    ...typography.body1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
  },
});
