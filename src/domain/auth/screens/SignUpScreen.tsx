import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { AgreementCheckbox } from '@/domain/auth/components/AgreementCheckbox';
import { useCheckLoginIdMutation } from '@/domain/auth/hooks/useCheckLoginIdMutation';
import { useSignUpMutation } from '@/domain/auth/hooks/useSignUpMutation';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

// 아이디 중복확인 → 비밀번호 입력 → 약관 동의 → 가입하기 순서의 단일 화면 회원가입 폼
export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const checkLoginIdMutation = useCheckLoginIdMutation();
  const signUpMutation = useSignUpMutation();

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const isAllAgreed = agreeTerms && agreePrivacy && agreeMarketing;
  const isRequiredAgreed = agreeTerms && agreePrivacy;

  const isSignUpDisabled =
    !isLoginIdAvailable ||
    !password ||
    isPasswordMismatch ||
    !isRequiredAgreed ||
    signUpMutation.isPending;

  const handleLoginIdChange = (value: string) => {
    setLoginId(value);
    // 아이디를 다시 수정하면 이전 중복확인 결과는 무효화
    setIsLoginIdAvailable(false);
    checkLoginIdMutation.reset();
  };

  const handleCheckDuplicate = () => {
    checkLoginIdMutation.mutate(
      { loginId },
      {
        onSuccess: (data) => setIsLoginIdAvailable(!data.isDuplicated),
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
      { loginId, password, agreeMarketing },
      {
        onSuccess: () => navigation.replace('Login'),
      },
    );
  };

  // 중복확인 API 자체는 성공(200)했지만 isDuplicated: true인 경우도 에러로 취급
  const loginIdErrorMessage = checkLoginIdMutation.data?.isDuplicated
    ? '이미 사용 중인 아이디입니다.'
    : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>회원가입</Text>

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
                variant="outline"
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
            <TextField
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              autoComplete="password-new"
              secureToggle
              errorMessage={isPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined}
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

          <Button
            label="가입하기"
            onPress={handleSignUpPress}
            loading={signUpMutation.isPending}
            disabled={isSignUpDisabled}
          />
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.xl,
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
});
