import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';
import appIcon from '@/assets/images/icon.png';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';

type StartScreenProps = NativeStackScreenProps<RootStackParamList, 'Start'>;

// 앱 첫 진입 화면: 로그인 화면으로 이동하거나 카카오로 바로 시작
export function StartScreen({ navigation }: StartScreenProps) {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleKakaoStart = () => {
    // TODO: 카카오 SDK 연동 후 카카오 로그인 플로우 연결 (api/v1/auth/login/kakao)
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <Image source={appIcon} style={styles.logoImage} />
          <Text style={styles.logo}>WithME</Text>
          <Text style={styles.tagline}>우리 모임, 더 쉽게</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Button label="WithME 로그인하기" variant="outline" onPress={handleLoginPress} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            label="카카오로 시작하기"
            variant="kakao"
            icon={<KakaoIcon />}
            onPress={handleKakaoStart}
          />

          <Pressable style={styles.signUpLink} onPress={handleSignUpPress} hitSlop={8}>
            <Text style={styles.signUpLinkText}>
              아직 계정이 없으신가요? <Text style={styles.signUpLinkHighlight}>회원가입</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  logo: {
    ...typography.heading1,
    color: colors.text.primary,
  },
  tagline: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    marginTop: spacing.sm,
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
