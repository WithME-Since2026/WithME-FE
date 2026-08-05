import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { ScreenHeader } from '@/common/components/ScreenHeader';
import { TextField } from '@/common/components/TextField';
import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';
import { useLoginMutation } from '@/domain/auth/hooks/useLoginMutation';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// 아이디/비밀번호 로그인, 카카오 로그인 진입점 화면
export function LoginScreen({ navigation }: LoginScreenProps) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending, isError } = useLoginMutation();

  const isSubmitDisabled = !loginId || !password;

  const handleLoginPress = () => {
    login({ loginId, password });
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 SDK 연동 후 카카오 로그인 플로우 연결 (api/v1/auth/login/kakao)
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleFindIdPress = () => {
    navigation.navigate('FindAccount', { initialTab: 'ID' });
  };

  const handleFindPasswordPress = () => {
    navigation.navigate('FindAccount', { initialTab: 'PASSWORD' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="로그인" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Text style={styles.logoText}>
              With<Text style={styles.logoTextAccent}>ME</Text>
            </Text>
          </View>

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

          <Button
            label="로그인"
            onPress={handleLoginPress}
            loading={isPending}
            disabled={isSubmitDisabled}
            style={styles.loginButton}
          />

          <View style={styles.findAccountRow}>
            <Pressable onPress={handleFindIdPress} hitSlop={8}>
              <Text style={styles.findAccountLinkText}>아이디 찾기</Text>
            </Pressable>
            <Text style={styles.findAccountDivider}>|</Text>
            <Pressable onPress={handleFindPasswordPress} hitSlop={8}>
              <Text style={styles.findAccountLinkText}>비밀번호 찾기</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            label="카카오로 로그인"
            variant="kakao"
            icon={<KakaoIcon />}
            onPress={handleKakaoLogin}
          />

          <Pressable style={styles.signUpLink} onPress={handleSignUpPress} hitSlop={8}>
            <Text style={styles.signUpLinkText}>
              아직 계정이 없으신가요? <Text style={styles.signUpLinkHighlight}>회원가입</Text>
            </Text>
          </Pressable>
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
    paddingTop: spacing.xxl * 1.5,
  },
  logoWrapper: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 42,
    lineHeight: 42,
    color: colors.text.primary,
  },
  logoTextAccent: {
    color: colors.primary,
  },
  form: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginBottom: spacing.md,
  },
  findAccountRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  findAccountLinkText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  findAccountDivider: {
    ...typography.caption,
    color: colors.border,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.disabled,
  },
  signUpLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  signUpLinkText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  signUpLinkHighlight: {
    fontWeight: '700',
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
});
