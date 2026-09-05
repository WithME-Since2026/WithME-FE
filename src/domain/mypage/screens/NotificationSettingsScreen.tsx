import { useState } from 'react';

import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { ToggleSwitch } from '@/common/components/ToggleSwitch';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';
import type { NotificationToggleKey } from '@/domain/mypage/components/NotificationSettingsPanel';
import {
  INITIAL_NOTIFICATION_TOGGLES,
  NotificationSettingsPanel,
} from '@/domain/mypage/components/NotificationSettingsPanel';
import { useNotificationSettingsQuery } from '@/domain/mypage/hooks/useNotificationSettingsQuery';
import { useUpdateNotificationSettingsMutation } from '@/domain/mypage/hooks/useUpdateNotificationSettingsMutation';

type NotificationSettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NotificationSettings'
>;

// 마이페이지 설정 목록의 "알림 설정"을 누르면 이동하는 전용 화면 (기존 인라인 드롭다운 패널을 화면 전환으로 대체)
export function NotificationSettingsScreen({ navigation }: NotificationSettingsScreenProps) {
  const { data: notificationSettings, isLoading, isError } = useNotificationSettingsQuery();
  const updateNotificationSettingsMutation = useUpdateNotificationSettingsMutation();

  // TODO: 모임별 알림 카테고리 API가 아직 없어(백엔드엔 notifyAgree 하나만 존재) 로컬 상태로만 관리.
  // 카테고리별 API가 추가되면 실제 값으로 교체할 것
  const [groupToggles, setGroupToggles] = useState(INITIAL_NOTIFICATION_TOGGLES);

  const handleTogglePushAll = () => {
    if (!notificationSettings) {
      return;
    }

    updateNotificationSettingsMutation.mutate({ notifyAgree: !notificationSettings.notifyAgree });
  };

  const handleToggleGroupNotification = (key: NotificationToggleKey) => {
    setGroupToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // TODO: 카카오 알림톡 구독 화면이 아직 없어 자리만 만들어 둠
  const handleKakaoAlimtalkPress = () => navigation.navigate('Subscription');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>알림 설정</Text>
        <View style={styles.backButton} />
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="알림 설정을 불러오지 못했습니다." />}

      {!isLoading && !isError && notificationSettings && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.pushAllRow}>
              <View style={styles.textGroup}>
                <Text style={styles.pushAllLabel}>푸시 알림 전체</Text>
                <Text style={styles.hint}>끄면 아래 모든 알림이 발송되지 않습니다</Text>
              </View>
              <ToggleSwitch
                value={notificationSettings.notifyAgree}
                onValueChange={handleTogglePushAll}
              />
            </View>
          </View>

          <View style={styles.devicePermissionRow}>
            <Text style={styles.devicePermissionText}>기기 알림 권한: 허용됨</Text>
            <Text style={styles.devicePermissionDivider}> · </Text>
            <Pressable onPress={() => Linking.openSettings()} hitSlop={8}>
              <Text style={styles.devicePermissionLink}>시스템 설정 열기</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>모임 알림</Text>
          <View style={styles.card}>
            <NotificationSettingsPanel
              toggles={groupToggles}
              onToggle={handleToggleGroupNotification}
            />
          </View>

          <Text style={styles.sectionLabel}>방식</Text>
          <View style={styles.card}>
            <Pressable style={styles.methodRow} onPress={handleKakaoAlimtalkPress}>
              <KakaoIcon size={36} background />
              <View style={styles.textGroup}>
                <Text style={styles.methodLabel}>카카오 알림톡</Text>
                <Text style={styles.hint}>프리미엄 전용</Text>
              </View>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeLabel}>PRO</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // 카드(colors.background: 흰색)와 배경 대비가 잘 보이도록 surface보다 짙은 회색 사용
    backgroundColor: colors.neutralSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.notifDivider,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.body1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
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
  pushAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  textGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  pushAllLabel: {
    ...typography.body2,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  hint: {
    ...typography.caption,
    fontSize: 11,
    color: colors.notifReadText,
    marginTop: 2,
  },
  devicePermissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  devicePermissionText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
  },
  devicePermissionDivider: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
  },
  devicePermissionLink: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.linkBlue,
  },
  sectionLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  methodLabel: {
    ...typography.body2,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  proBadge: {
    paddingHorizontal: spacing.sm,
    height: 22,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.premiumTitleText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBadgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.premiumGold,
  },
});
