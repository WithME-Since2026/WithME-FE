import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type WithdrawCompleteScreenProps = NativeStackScreenProps<RootStackParamList, 'WithdrawComplete'>;

// 회원 탈퇴 완료 안내 화면 (Figma node 883:96)
export function WithdrawCompleteScreen({ navigation }: WithdrawCompleteScreenProps) {
  // 탈퇴가 끝난 계정이므로 로그아웃과 동일하게 스택을 초기화해 시작 화면으로 돌아감
  const handleGoHomePress = () => navigation.reset({ index: 0, routes: [{ name: 'Start' }] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>탈퇴가 완료되었습니다</Text>
        <Text style={styles.subtitle}>
          그동안 WithME를 이용해 주셔서{'\n'}감사합니다{' '}
          <FontAwesome5 name="pray" size={13} color={colors.text.secondary} solid />
        </Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeItem}>· 데이터는 30일 후 완전히 삭제됩니다</Text>
          <Text style={styles.noticeItem}>· 참여 중인 모임은 자동 탈퇴 처리됩니다</Text>
          <Text style={styles.noticeItem}>· 결제 수단 정보는 즉시 삭제됩니다</Text>
        </View>
      </View>

      <Pressable style={styles.homeButton} onPress={handleGoHomePress}>
        <Text style={styles.homeButtonLabel}>홈으로 돌아가기</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading1,
    fontSize: 24,
    color: colors.textStrong,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  noticeBox: {
    width: '100%',
    backgroundColor: colors.premiumInfoBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  noticeItem: {
    ...typography.caption,
    fontSize: 12,
    color: colors.premiumInfoText,
  },
  homeButton: {
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  homeButtonLabel: {
    ...typography.body1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
