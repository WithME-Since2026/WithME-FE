import { StyleSheet, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type StartScreenProps = NativeStackScreenProps<RootStackParamList, 'Start'>;

// 앱 첫 진입 화면: 로그인 화면으로 이동하거나 카카오로 바로 시작
export function StartScreen({ navigation }: StartScreenProps) {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleKakaoStart = () => {
    // TODO: 카카오 SDK 연동 후 카카오 로그인 플로우 연결 (api/v1/auth/login/kakao)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <Text style={styles.logo}>WithME</Text>
          <Text style={styles.tagline}>{'참여자 앱 설치 없이,\n일정 조율을 한 곳에서 끝내요'}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Button label="WithME 로그인하기" variant="outline" onPress={handleLoginPress} />
          <Button label="카카오로 시작하기" variant="kakao" onPress={handleKakaoStart} />
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
});
