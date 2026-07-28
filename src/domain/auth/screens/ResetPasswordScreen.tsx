import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { ScreenHeader } from '@/common/components/ScreenHeader';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';
import { getPasswordRuleStatus, isPasswordValid } from '@/common/utils/validators';

import type { RootStackParamList } from '@/app/navigation';

import { PasswordRequirementList } from '@/domain/auth/components/PasswordRequirementList';
import { useResetPasswordMutation } from '@/domain/auth/hooks/useResetPasswordMutation';

type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

// 계정 찾기(비밀번호 찾기) 탭에서 이메일 인증을 마친 뒤 새 비밀번호를 설정하는 화면
export function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
  const { loginId, email, code } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPasswordMutation = useResetPasswordMutation();

  const passwordRuleStatus = getPasswordRuleStatus(newPassword);
  const isPasswordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isSubmitDisabled =
    !isPasswordValid(newPassword) ||
    !confirmPassword ||
    isPasswordMismatch ||
    resetPasswordMutation.isPending;

  const handleCompletePress = () => {
    resetPasswordMutation.mutate(
      { loginId, email, code, newPassword },
      { onSuccess: () => navigation.replace('Login') },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="비밀번호 재설정" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.helperText}>새로운 비밀번호를 입력해주세요</Text>

          <TextField
            label="새 비밀번호"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChangeText={setNewPassword}
            autoComplete="password-new"
            secureToggle
          />

          <TextField
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="password-new"
            secureToggle
            errorMessage={isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined}
          />

          <PasswordRequirementList status={passwordRuleStatus} />

          {resetPasswordMutation.isError && (
            <Text style={styles.submitError}>
              비밀번호 재설정에 실패했습니다. 다시 시도해주세요.
            </Text>
          )}

          <View style={styles.footer}>
            <Button
              label="완료"
              onPress={handleCompletePress}
              loading={resetPasswordMutation.isPending}
              disabled={isSubmitDisabled}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  helperText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  submitError: {
    ...typography.caption,
    color: colors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
