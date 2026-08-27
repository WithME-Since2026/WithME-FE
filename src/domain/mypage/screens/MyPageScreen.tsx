import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';
import { AttendanceStatsCard } from '@/domain/mypage/components/AttendanceStatsCard';
import type { NotificationToggleKey } from '@/domain/mypage/components/NotificationSettingsPanel';
import {
  INITIAL_NOTIFICATION_TOGGLES,
  NotificationSettingsPanel,
} from '@/domain/mypage/components/NotificationSettingsPanel';
import { ProfileCard } from '@/domain/mypage/components/ProfileCard';
import { SettingsListItem } from '@/domain/mypage/components/SettingsListItem';
import { WeeklyAttendanceChart } from '@/domain/mypage/components/WeeklyAttendanceChart';
import { useLogoutMutation } from '@/domain/mypage/hooks/useLogoutMutation';
import { useMyPageAttendanceQuery } from '@/domain/mypage/hooks/useMyPageAttendanceQuery';
import { useMyPageProfileQuery } from '@/domain/mypage/hooks/useMyPageProfileQuery';
import { useNotificationsQuery } from '@/domain/notification/hooks/useNotificationsQuery';

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
  const { data: notifications } = useNotificationsQuery();
  // 로그아웃/탈퇴 확인 모달에서 어느 액션을 확인 중인지 (Figma node 761:17659)
  const [pendingExitAction, setPendingExitAction] = useState<'logout' | 'withdraw' | null>(null);
  const [isNotificationSettingsExpanded, setIsNotificationSettingsExpanded] = useState(false);
  // 패널을 접었다 펼쳐도 토글 상태가 유지되도록 부모(이 화면)가 소유한다
  const [notificationToggles, setNotificationToggles] = useState(INITIAL_NOTIFICATION_TOGGLES);

  const isLoading = isProfileLoading || isAttendanceLoading;
  const isError = isProfileError || isAttendanceError;
  const hasUnreadNotifications =
    notifications?.some((notification) => !notification.isRead) ?? false;

  // TODO: 회원 탈퇴 API가 아직 명세되지 않아 우선 자리만 만들어 둠
  const handleWithdraw = () => {};

  const handleConfirmExit = () => {
    if (pendingExitAction === 'logout') {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
        },
      });
    } else if (pendingExitAction === 'withdraw') {
      handleWithdraw();
    }

    setPendingExitAction(null);
  };

  // 알림 설정은 별도 화면/팝업이 아니라, 마이페이지 설정 목록에서 바로 그 아래로 펼쳐지는 형태로 관리한다.
  const handleNotificationSettingsPress = () => setIsNotificationSettingsExpanded((prev) => !prev);
  const handleToggleNotification = (key: NotificationToggleKey) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleEditProfilePress = () => navigation.navigate('ProfileEdit');

  // TODO: 내 모임 관리/결제수단 등록/문제 신고/프리미엄 화면이 아직 없어 우선 자리만 만들어 둠
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
          {hasUnreadNotifications && <View style={styles.bellDot} />}
        </Pressable>
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="마이페이지 정보를 불러오지 못했습니다." />}

      {!isLoading && !isError && profile && attendance && (
        <ScrollView contentContainerStyle={styles.content}>
          <ProfileCard profile={profile} onEditPress={handleEditProfilePress} />

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
            <KakaoIcon size={36} background />
            <View style={styles.premiumBody}>
              <View style={styles.premiumTitleRow}>
                <Text style={styles.premiumTitle}>프리미엄 업그레이드</Text>
                <View style={styles.premiumProBadge}>
                  <Text style={styles.premiumProBadgeLabel}>PRO</Text>
                </View>
              </View>
              <Text style={styles.premiumSubtitle}>알림톡 리마인드 · 첫 달 100원</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <View style={styles.settingsCard}>
            <SettingsListItem
              label="내 모임 관리"
              badge={{ label: '3', variant: 'accent' }}
              onPress={noop}
            />
            <SettingsListItem
              label="알림 설정"
              onPress={handleNotificationSettingsPress}
              expanded={isNotificationSettingsExpanded}
              showDivider={!isNotificationSettingsExpanded}
            />
            {isNotificationSettingsExpanded && (
              <NotificationSettingsPanel
                toggles={notificationToggles}
                onToggle={handleToggleNotification}
              />
            )}
            <SettingsListItem
              label="결제수단 등록"
              badge={{ label: '카드 · 1234', variant: 'neutral' }}
              onPress={noop}
            />
            <SettingsListItem label="문제 신고" onPress={noop} showDivider={false} />
          </View>

          <View style={styles.exitRow}>
            <Pressable onPress={() => setPendingExitAction('logout')} hitSlop={8}>
              <Text style={styles.logoutLabel}>로그아웃</Text>
            </Pressable>
            <Pressable onPress={() => setPendingExitAction('withdraw')} hitSlop={8}>
              <Text style={styles.withdrawLabel}>회원 탈퇴</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <ConfirmModal
        visible={pendingExitAction !== null}
        // 로그아웃 문구만 확정 반영. 탈퇴 문구는 아직 그대로 둠(추후 별도 요청 시 변경)
        message={pendingExitAction === 'logout' ? '정말 로그아웃 하시겠어요?' : '정말 떠나시나요?'}
        onCancel={() => setPendingExitAction(null)}
        onConfirm={handleConfirmExit}
      />

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
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.heading1,
    fontSize: 26,
    color: colors.textStrong,
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
    paddingHorizontal: 20,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    // Figma 실제 값(아이콘~텍스트 간격 12px)
    gap: 12,
    height: 68,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.premiumGold,
    paddingHorizontal: 12,
    // Figma 실제 값: 0px 2px 4px rgba(200,168,75,0.15)
    shadowColor: colors.premiumGold,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    color: colors.premiumTitleText,
  },
  premiumProBadge: {
    width: 28,
    height: 15,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.premiumTitleText,
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
    color: colors.textMuted,
    marginTop: 2,
  },
  settingsCard: {
    borderRadius: 24,
    backgroundColor: colors.background,
    overflow: 'hidden',
    // Figma 실제 값: 0px 1px 2px rgba(0,0,0,0.08)
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  exitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.sm,
  },
  logoutLabel: {
    ...typography.caption,
    fontWeight: '500',
    // Figma 실제 값(#49454F) — 알림 화면의 읽음 처리된 본문 색과 동일해 재사용
    color: colors.notifReadText,
  },
  withdrawLabel: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.destructiveText,
  },
});
