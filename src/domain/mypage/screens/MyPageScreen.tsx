import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { AttendanceStatsCard } from '@/domain/mypage/components/AttendanceStatsCard';
import { ProfileCard } from '@/domain/mypage/components/ProfileCard';
import { SettingsListItem } from '@/domain/mypage/components/SettingsListItem';
import { WeeklyAttendanceChart } from '@/domain/mypage/components/WeeklyAttendanceChart';
import { useLogoutMutation } from '@/domain/mypage/hooks/useLogoutMutation';
import { useMyPageAttendanceQuery } from '@/domain/mypage/hooks/useMyPageAttendanceQuery';
import { useMyPageProfileQuery } from '@/domain/mypage/hooks/useMyPageProfileQuery';
import { useNotificationSettingsQuery } from '@/domain/mypage/hooks/useNotificationSettingsQuery';
import { useUpdateNotificationSettingsMutation } from '@/domain/mypage/hooks/useUpdateNotificationSettingsMutation';

type MyPageScreenProps = NativeStackScreenProps<RootStackParamList, 'MyPage'>;

// 프로필/참여율 통계/설정 메뉴를 모아 보여주는 마이페이지 화면
// 하단 탭바는 다른 팀원이 별도로 작업 중이라 여기서는 자리만 비워둠 (충돌 방지)
export function MyPageScreen({ navigation }: MyPageScreenProps) {
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
  const logoutMutation = useLogoutMutation();
  const { data: notificationSettings } = useNotificationSettingsQuery();
  const updateNotificationSettingsMutation = useUpdateNotificationSettingsMutation();

  const isLoading = isProfileLoading || isAttendanceLoading;
  const isError = isProfileError || isAttendanceError;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
      },
    });
  };

  // 알림 수신 동의 여부를 허용/허용 안 함 프롬프트로 물어보고 PATCH /api/v1/users/me/notifications에 반영
  const handleNotificationSettingsPress = () => {
    Alert.alert('알림 허용', '모임 일정과 리마인드 알림을 받아보시려면 알림을 허용해주세요.', [
      {
        text: '허용 안 함',
        style: 'cancel',
        onPress: () => updateNotificationSettingsMutation.mutate({ notifyAgree: false }),
      },
      {
        text: '허용',
        onPress: () => updateNotificationSettingsMutation.mutate({ notifyAgree: true }),
      },
    ]);
  };

  // TODO: 회원 탈퇴 API가 아직 명세되지 않아 우선 자리만 만들어 둠
  const handleWithdraw = () => {};

  // TODO: 내 모임 관리/결제수단 등록/문제 신고/편집/프리미엄 화면이 아직 없어 우선 자리만 만들어 둠
  const noop = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>마이페이지</Text>
        <Pressable
          style={styles.bellButton}
          onPress={() => navigation.navigate('Notification')}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="마이페이지 정보를 불러오지 못했습니다." />}

      {!isLoading && !isError && profile && attendance && (
        <ScrollView contentContainerStyle={styles.content}>
          <ProfileCard profile={profile} onEditPress={noop} />

          <AttendanceStatsCard
            groupCount={attendance.groupCount}
            monthlyAttendCount={attendance.monthlyAttendCount}
            averageAttendanceRate={attendance.averageAttendanceRate}
          />

          <WeeklyAttendanceChart
            averageAttendanceRate={attendance.averageAttendanceRate}
            weeks={attendance.recentWeeks}
          />

          <Pressable style={styles.premiumBanner} onPress={noop}>
            <View style={styles.premiumIcon}>
              <Ionicons name="chatbubble-ellipses" size={18} color={colors.kakaoText} />
            </View>
            <View style={styles.premiumBody}>
              <View style={styles.premiumTitleRow}>
                <Text style={styles.premiumTitle}>프리미엄 업그레이드</Text>
                <View style={styles.premiumProBadge}>
                  <Text style={styles.premiumProBadgeLabel}>PRO</Text>
                </View>
              </View>
              <Text style={styles.premiumSubtitle}>알림톡 리마인드 · 첫 달 100원</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
          </Pressable>

          <View style={styles.settingsCard}>
            <SettingsListItem
              label="내 모임 관리"
              badge={{ label: '3', variant: 'accent' }}
              onPress={noop}
            />
            <SettingsListItem
              label="알림 설정"
              badge={
                notificationSettings
                  ? notificationSettings.notifyAgree
                    ? { label: '켜짐', variant: 'accent' }
                    : { label: '꺼짐', variant: 'neutral' }
                  : undefined
              }
              onPress={handleNotificationSettingsPress}
            />
            <SettingsListItem
              label="결제수단 등록"
              badge={{ label: '카드 · 1234', variant: 'neutral' }}
              onPress={noop}
            />
            <SettingsListItem label="문제 신고" onPress={noop} showDivider={false} />
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutLabel}>로그아웃</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.error} />
          </Pressable>

          <Pressable style={styles.withdrawButton} onPress={handleWithdraw} hitSlop={8}>
            <Text style={styles.withdrawLabel}>탈퇴하기</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* TODO: 하단 탭바(홈/캘린더/마이)는 다른 팀원이 작업 중 — 완료되면 여기에 연결 */}
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.heading1,
    fontSize: 26,
    color: colors.text.primary,
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.premiumGold,
    padding: spacing.sm,
  },
  premiumIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.kakao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBody: {
    flex: 1,
  },
  premiumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  premiumTitle: {
    ...typography.body2,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  premiumProBadge: {
    paddingHorizontal: spacing.xs,
    height: 15,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumProBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.premiumGold,
  },
  premiumSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  settingsCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  logoutLabel: {
    ...typography.body2,
    fontSize: 15,
    color: colors.error,
  },
  withdrawButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  withdrawLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
