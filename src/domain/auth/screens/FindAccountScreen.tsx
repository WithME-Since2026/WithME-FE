import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { ScreenHeader } from '@/common/components/ScreenHeader';
import { SegmentedTabs } from '@/common/components/SegmentedTabs';
import { TextField } from '@/common/components/TextField';
import { useCountdown } from '@/common/hooks/useCountdown';
import { colors, spacing } from '@/common/styles/theme';
import { isValidEmail } from '@/common/utils/validators';

import type { RootStackParamList } from '@/app/navigation';

import { DevResetLink } from '@/domain/auth/components/DevResetLink';
import { EmailVerificationField } from '@/domain/auth/components/EmailVerificationField';
import { useCheckEmailCodeMutation } from '@/domain/auth/hooks/useCheckEmailCodeMutation';
import { useFindLoginIdMutation } from '@/domain/auth/hooks/useFindLoginIdMutation';
import { useSendEmailCodeMutation } from '@/domain/auth/hooks/useSendEmailCodeMutation';

// TODO: 인증번호 유효 시간은 백엔드 명세 확정 전 임시로 5분(300초)으로 가정
const CODE_EXPIRATION_SECONDS = 300;

type FindTab = 'ID' | 'PASSWORD';

type FindAccountScreenProps = NativeStackScreenProps<RootStackParamList, 'FindAccount'>;

// 아이디 찾기 / 비밀번호 찾기 탭으로 이메일 인증 후 각각 다른 다음 화면으로 이동하는 계정 찾기 화면
export function FindAccountScreen({ navigation, route }: FindAccountScreenProps) {
  const [activeTab, setActiveTab] = useState<FindTab>(route.params?.initialTab ?? 'ID');
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [hasSentCode, setHasSentCode] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState<string>();

  const {
    remainingSeconds,
    start: startCountdown,
    reset: resetCountdown,
  } = useCountdown(CODE_EXPIRATION_SECONDS);

  const sendEmailCodeMutation = useSendEmailCodeMutation();
  const checkEmailCodeMutation = useCheckEmailCodeMutation();
  const findLoginIdMutation = useFindLoginIdMutation();

  const isEmailFormatValid = email.length === 0 || isValidEmail(email);
  const isCodeExpired = hasSentCode && remainingSeconds <= 0;

  const identifierValue = activeTab === 'ID' ? name : loginId;
  const isNextDisabled =
    !hasSentCode ||
    !code ||
    !identifierValue ||
    isCodeExpired ||
    checkEmailCodeMutation.isPending ||
    findLoginIdMutation.isPending;

  const handleTabChange = (tab: FindTab) => {
    setActiveTab(tab);
    setEmail('');
    setCode('');
    setHasSentCode(false);
    setCodeErrorMessage(undefined);
    resetCountdown();
    sendEmailCodeMutation.reset();
    checkEmailCodeMutation.reset();
    findLoginIdMutation.reset();
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeErrorMessage(undefined);
  };

  const handleSendCode = () => {
    sendEmailCodeMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setHasSentCode(true);
          setCode('');
          setCodeErrorMessage(undefined);
          startCountdown();
        },
      },
    );
  };

  const handleNextPress = () => {
    checkEmailCodeMutation.mutate(
      { email, code },
      {
        onSuccess: (data) => {
          if (!data.verified) {
            setCodeErrorMessage('인증번호가 일치하지 않습니다.');
            return;
          }

          if (activeTab === 'ID') {
            findLoginIdMutation.mutate(
              { name, email, code },
              {
                onSuccess: (result) =>
                  navigation.navigate('FindIdResult', { loginId: result.loginId }),
              },
            );
            return;
          }

          navigation.navigate('ResetPassword', { loginId, email, code });
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="계정 찾기" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SegmentedTabs
            tabs={[
              { value: 'ID', label: '아이디 찾기' },
              { value: 'PASSWORD', label: '비밀번호 찾기' },
            ]}
            value={activeTab}
            onChange={handleTabChange}
          />

          <View style={styles.form}>
            {activeTab === 'ID' ? (
              <TextField
                label="이름"
                placeholder="이름을 입력해주세요"
                value={name}
                onChangeText={setName}
              />
            ) : (
              <TextField
                label="아이디"
                placeholder="아이디를 입력해주세요"
                value={loginId}
                onChangeText={setLoginId}
                autoComplete="username"
              />
            )}

            <EmailVerificationField
              email={email}
              onEmailChange={setEmail}
              emailErrorMessage={!isEmailFormatValid ? '올바른 이메일 형식이 아닙니다.' : undefined}
              isSendDisabled={!isEmailFormatValid}
              hasSentCode={hasSentCode}
              isSendingCode={sendEmailCodeMutation.isPending}
              onSendCode={handleSendCode}
              code={code}
              onCodeChange={handleCodeChange}
              codeErrorMessage={codeErrorMessage}
              remainingSeconds={remainingSeconds}
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="다음"
              onPress={handleNextPress}
              loading={checkEmailCodeMutation.isPending || findLoginIdMutation.isPending}
              disabled={isNextDisabled}
            />
            <DevResetLink navigation={navigation} />
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
  form: {
    marginTop: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
});
