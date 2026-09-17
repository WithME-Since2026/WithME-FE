import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { WithdrawStepHeader } from '@/domain/mypage/components/WithdrawStepHeader';
import { useMyGroupsQuery } from '@/domain/mypage/hooks/useMyGroupsQuery';
import { useMyPageAttendanceQuery } from '@/domain/mypage/hooks/useMyPageAttendanceQuery';

type WithdrawConfirmScreenProps = NativeStackScreenProps<RootStackParamList, 'WithdrawConfirm'>;

const WITHDRAW_CONFIRM_PHRASE = '탈퇴합니다';

// 회원 탈퇴 3/3: 데이터 유실 확인 체크 + "탈퇴합니다" 문구 입력을 모두 마쳐야 탈퇴 버튼이 활성화되는 최종 확인 화면 (Figma node 885:20)
export function WithdrawConfirmScreen({ navigation }: WithdrawConfirmScreenProps) {
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useMyPageAttendanceQuery();
  const { data: groups, isLoading: isGroupsLoading, isError: isGroupsError } = useMyGroupsQuery();
  const [isDataLossChecked, setIsDataLossChecked] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const isLoading = isAttendanceLoading || isGroupsLoading;
  const isError = isAttendanceError || isGroupsError;
  const isWithdrawEnabled = isDataLossChecked && confirmText === WITHDRAW_CONFIRM_PHRASE;

  // TODO: 회원 탈퇴 API가 아직 명세되지 않아, 연동 전까지 완료 화면으로 이동하는 것으로 시뮬레이션
  const handleWithdrawPress = () => {
    if (!isWithdrawEnabled) {
      return;
    }

    navigation.navigate('WithdrawComplete');
  };

  const handleCancelPress = () => navigation.navigate('MyPage');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <WithdrawStepHeader step={3} onBackPress={() => navigation.goBack()} />

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="회원 정보를 불러오지 못했습니다." />}

      {!isLoading && !isError && attendance && groups && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>마지막 확인이에요</Text>
            <Text style={styles.subtitle}>아래 두 가지를 확인하면 탈퇴 버튼이 활성화됩니다.</Text>
          </View>

          <Pressable
            style={styles.checkboxCard}
            onPress={() => setIsDataLossChecked((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isDataLossChecked }}
          >
            <Ionicons
              name={isDataLossChecked ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={isDataLossChecked ? colors.primary : colors.neutralBorder}
              style={styles.checkboxIcon}
            />
            <Text style={styles.checkboxLabel}>
              참여 모임 {groups.length}개, 참석 기록 {attendance.monthlyAttendCount}건, 프리미엄
              구독이 복구되지 않는다는 점을 확인했습니다.
            </Text>
          </Pressable>

          <View style={styles.confirmTextSection}>
            <Text style={styles.confirmTextLabel}>
              확인을 위해 <Text style={styles.confirmTextHighlight}>{WITHDRAW_CONFIRM_PHRASE}</Text>{' '}
              를 입력해주세요.
            </Text>
            <TextInput
              style={styles.confirmInput}
              placeholder={WITHDRAW_CONFIRM_PHRASE}
              placeholderTextColor={colors.text.disabled}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.footerNotice}>
            탈퇴 후 30일간 같은 카카오 계정으로 재가입할 수 없습니다. 법령에 따라{'\n'}결제 기록은
            5년간 별도 보관됩니다.
          </Text>

          <Pressable
            style={[styles.withdrawButton, !isWithdrawEnabled && styles.withdrawButtonDisabled]}
            onPress={handleWithdrawPress}
            disabled={!isWithdrawEnabled}
          >
            <Text
              style={[
                styles.withdrawButtonLabel,
                !isWithdrawEnabled && styles.withdrawButtonLabelDisabled,
              ]}
            >
              회원 탈퇴
            </Text>
          </Pressable>

          <Pressable onPress={handleCancelPress} hitSlop={8} style={styles.cancelButton}>
            <Text style={styles.cancelLabel}>취소</Text>
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
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  checkboxCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  checkboxIcon: {
    marginTop: 2,
    marginRight: spacing.sm,
  },
  checkboxLabel: {
    flex: 1,
    ...typography.caption,
    fontSize: 13,
    color: colors.textStrong,
    lineHeight: 18,
  },
  confirmTextSection: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  confirmTextLabel: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textMuted,
  },
  confirmTextHighlight: {
    fontWeight: '600',
    color: colors.destructiveText,
  },
  confirmInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
    ...typography.body2,
    color: colors.text.primary,
  },
  footerNotice: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.disabled,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  withdrawButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  withdrawButtonDisabled: {
    backgroundColor: colors.border,
  },
  withdrawButtonLabel: {
    ...typography.body1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  withdrawButtonLabelDisabled: {
    color: colors.textMuted,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cancelLabel: {
    ...typography.body2,
    fontSize: 15,
    color: colors.text.secondary,
  },
});
