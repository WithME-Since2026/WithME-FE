import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

type PaymentCompleteScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentComplete'>;

const NOTICES = [
  '알림톡 리마인드가 즉시 활성화됩니다',
  '이후 매월 2,990원이 자동 결제됩니다',
  '구독 해지는 마이페이지에서 언제든 가능합니다',
];

// 프리미엄 구독 결제 완료 화면 (Figma node 883:96 "탈퇴 완료" 레이아웃을 재사용, 문구만 결제 완료 맥락으로 변경)
export function PaymentCompleteScreen({ navigation }: PaymentCompleteScreenProps) {
  const handleGoHomePress = () => navigation.reset({ index: 0, routes: [{ name: 'MyPage' }] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={64} color={colors.primary} />
        </View>

        <Text style={styles.title}>결제가 완료되었습니다</Text>
        <Text style={styles.subtitle}>WithME 프리미엄을 이용해 주셔서{'\n'}감사합니다</Text>

        <View style={styles.noticeBox}>
          {NOTICES.map((notice) => (
            <Text key={notice} style={styles.noticeText}>
              · {notice}
            </Text>
          ))}
        </View>

        <Button
          label="홈으로 돌아가기"
          variant="primary"
          onPress={handleGoHomePress}
          style={styles.homeButton}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.premiumAccentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading2,
    fontSize: 24,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body2,
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  homeButton: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  noticeBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.premiumInfoBg,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  noticeText: {
    ...typography.caption,
    color: colors.premiumInfoText,
  },
});
