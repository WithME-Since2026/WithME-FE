import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { ScreenHeader } from '@/common/components/ScreenHeader';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';
import { getPasswordRuleStatus, isPasswordValid, isValidEmail } from '@/common/utils/validators';

import type { RootStackParamList } from '@/app/navigation';

import { AgreementCheckbox } from '@/domain/auth/components/AgreementCheckbox';
import { EmailDomainField } from '@/domain/auth/components/EmailDomainField';
import { PasswordRequirementList } from '@/domain/auth/components/PasswordRequirementList';
import { SignUpStepIndicator } from '@/domain/auth/components/SignUpStepIndicator';
import { useCheckLoginIdMutation } from '@/domain/auth/hooks/useCheckLoginIdMutation';
import { useSignUpMutation } from '@/domain/auth/hooks/useSignUpMutation';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

// 아이디 중복확인 → 비밀번호 입력 → 약관 동의 → 가입하기 순서의 단일 화면 회원가입 폼
export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  // 응답이 도착한 시점의 loginId를 함께 저장해 최신 loginId와 다르면 결과를 무시함
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<{
    loginId: string;
    isDuplicated: boolean;
  } | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const checkLoginIdMutation = useCheckLoginIdMutation();
  const signUpMutation = useSignUpMutation();

  const isLoginIdAvailable =
    duplicateCheckResult?.loginId === loginId && !duplicateCheckResult.isDuplicated;

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const passwordRuleStatus = getPasswordRuleStatus(password);
  const email = emailLocal && emailDomain ? `${emailLocal}@${emailDomain}` : '';
  const isEmailFormatValid = email.length === 0 || isValidEmail(email);
  const isAllAgreed = agreeTerms && agreePrivacy && agreeMarketing;
  const isRequiredAgreed = agreeTerms && agreePrivacy;

  const isSignUpDisabled =
    !isLoginIdAvailable ||
    !isPasswordValid(password) ||
    isPasswordMismatch ||
    !email ||
    !isEmailFormatValid ||
    !isRequiredAgreed ||
    signUpMutation.isPending;

  const handleLoginIdChange = (value: string) => {
    setLoginId(value);
    // 아이디를 다시 수정하면 이전 중복확인 결과는 무효화
    // (reset()은 진행 중인 요청을 취소하지 않으므로, 결과 매칭은 loginId 비교로 처리)
    setDuplicateCheckResult(null);
    checkLoginIdMutation.reset();
  };

  const handleCheckDuplicate = () => {
    const requestedLoginId = loginId;
    checkLoginIdMutation.mutate(
      { loginId: requestedLoginId },
      {
        onSuccess: (data) =>
          setDuplicateCheckResult({ loginId: requestedLoginId, isDuplicated: data.isDuplicated }),
      },
    );
  };

  const handleToggleAll = () => {
    const next = !isAllAgreed;
    setAgreeTerms(next);
    setAgreePrivacy(next);
    setAgreeMarketing(next);
  };

  const handleSignUpPress = () => {
    signUpMutation.mutate(
      { loginId, password, email, agreeMarketing },
      {
        onSuccess: () => navigation.replace('Onboarding'),
      },
    );
  };

  // 중복확인 API 자체는 성공(200)했지만 isDuplicated: true인 경우도 에러로 취급
  const loginIdErrorMessage =
    duplicateCheckResult?.loginId === loginId && duplicateCheckResult.isDuplicated
      ? '이미 사용 중인 아이디입니다.'
      : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="회원가입" />
      <SignUpStepIndicator label="계정 정보 입력" progress={0.45} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.idRow}>
              <View style={styles.idInput}>
                <TextField
                  label="아이디"
                  placeholder="아이디를 입력해주세요"
                  value={loginId}
                  onChangeText={handleLoginIdChange}
                  autoComplete="username"
                  errorMessage={loginIdErrorMessage}
                />
              </View>
              <Button
                label="중복확인"
                variant="primary"
                onPress={handleCheckDuplicate}
                loading={checkLoginIdMutation.isPending}
                disabled={!loginId}
                style={styles.idCheckButton}
              />
            </View>
            {isLoginIdAvailable && (
              <Text style={styles.availableText}>사용 가능한 아이디입니다.</Text>
            )}

            <TextField
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChangeText={setPassword}
              autoComplete="password-new"
              secureToggle
            />

            <PasswordRequirementList status={passwordRuleStatus} />

            <TextField
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              autoComplete="password-new"
              secureToggle
              errorMessage={isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined}
            />

            <EmailDomainField
              local={emailLocal}
              onLocalChange={setEmailLocal}
              domain={emailDomain}
              onDomainChange={setEmailDomain}
              errorMessage={!isEmailFormatValid ? '올바른 이메일 형식이 아닙니다.' : undefined}
            />
          </View>

          <View style={styles.agreements}>
            <AgreementCheckbox
              label="전체 동의"
              checked={isAllAgreed}
              onToggle={handleToggleAll}
              bold
            />
            <AgreementCheckbox
              label="서비스 이용약관"
              requiredLabel="필수"
              checked={agreeTerms}
              onToggle={() => setAgreeTerms((prev) => !prev)}
            />
            <AgreementCheckbox
              label="개인정보 처리방침"
              requiredLabel="필수"
              checked={agreePrivacy}
              onToggle={() => setAgreePrivacy((prev) => !prev)}
            />
            <AgreementCheckbox
              label="마케팅 수신 동의"
              requiredLabel="선택"
              checked={agreeMarketing}
              onToggle={() => setAgreeMarketing((prev) => !prev)}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="가입하기"
            onPress={handleSignUpPress}
            loading={signUpMutation.isPending}
            disabled={isSignUpDisabled}
          />
        </View>
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
    paddingBottom: spacing.md,
  },
  form: {
    marginBottom: spacing.md,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  idInput: {
    flex: 1,
  },
  // TextField 컨테이너의 하단 marginBottom(spacing.md)만큼 맞춰줘야
  // idRow의 alignItems: 'flex-end' 기준으로 버튼과 입력창 바닥이 정렬됨
  idCheckButton: {
    marginBottom: spacing.md,
  },
  availableText: {
    ...typography.caption,
    color: colors.success,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  agreements: {
    marginBottom: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
