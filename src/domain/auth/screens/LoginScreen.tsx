import { useState } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { useLoginMutation } from '@/domain/auth/hooks/useLoginMutation';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// 아이디/비밀번호 로그인, 카카오 로그인 진입점 화면
export function LoginScreen(_props: LoginScreenProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending, isError } = useLoginMutation();

  const isSubmitDisabled = !loginId || !password;

  const handleLoginPress = () => {
    login({ loginId, password });
  };

  const handleKakaoStart = () => {
    // TODO: 카카오 SDK 연동 후 카카오 로그인 플로우 연결 (api/v1/auth/login/kakao)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>로그인</Text>

          <View style={styles.form}>
            <TextField
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={loginId}
              onChangeText={setLoginId}
              autoComplete="username"
            />
            <TextField
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              secureToggle
              errorMessage={isError ? '아이디 또는 비밀번호를 확인해주세요.' : undefined}
            />
          </View>

          <View style={styles.buttonGroup}>
            <Button
              label="로그인"
              onPress={handleLoginPress}
              loading={isPending}
              disabled={isSubmitDisabled}
            />
            <Button label="카카오로 시작하기" variant="kakao" onPress={handleKakaoStart} />
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
