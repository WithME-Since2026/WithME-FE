import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { DevResetLink } from '@/common/components/DevResetLink';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type FindIdResultScreenProps = NativeStackScreenProps<RootStackParamList, 'FindIdResult'>;

// 이메일 인증 완료 후 찾은 아이디를 보여주고 로그인 화면으로 이동시키는 화면
export function FindIdResultScreen({ navigation, route }: FindIdResultScreenProps) {
  const { loginId } = route.params;

  const handleLoginPress = () => {
    navigation.replace('Login');
  };

  const handleFindPasswordPress = () => {
    navigation.navigate('FindAccount', { initialTab: 'PASSWORD' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.body}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.title}>인증이 완료되었습니다</Text>
          <Text style={styles.loginId}>{loginId}</Text>
        </View>

        <View style={styles.footer}>
          <Button label="로그인하기" onPress={handleLoginPress} />
          <Pressable style={styles.findPasswordLink} onPress={handleFindPasswordPress} hitSlop={8}>
            <Text style={styles.findPasswordLinkText}>비밀번호 찾기</Text>
          </Pressable>
          <DevResetLink navigation={navigation} />
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
    paddingVertical: spacing.xl,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  checkMark: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.background,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  loginId: {
    ...typography.heading2,
    color: colors.primary,
  },
  footer: {
    gap: spacing.sm,
  },
  findPasswordLink: {
    alignItems: 'center',
  },
  findPasswordLinkText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
});
