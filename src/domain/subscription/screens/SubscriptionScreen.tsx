import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { KakaoIcon } from '@/domain/auth/components/KakaoIcon';

type SubscriptionScreenProps = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

const FEATURES = [
  '미응답자에게 알림톡 리마인드 무제한',
  '일정 변경 시 자동 재확인도 알림톡으로',
  '알림톡 발송·열람 현황 확인',
];

// 카카오 알림톡 프리미엄 구독 유도 화면 (Figma node 296:1854)
export function SubscriptionScreen({ navigation }: SubscriptionScreenProps) {
  const handleStartPress = () => navigation.navigate('PaymentMethod');

  // TODO: 인앱결제(IAP) 구매 복원이 아직 연동되지 않아 우선 자리만 만들어 둠
  const handleRestorePress = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} accessibilityLabel="닫기">
          <Ionicons name="close" size={22} color={colors.text.primary} />
        </Pressable>
        <Pressable onPress={handleRestorePress} hitSlop={8}>
          <Text style={styles.restoreLabel}>구매 복원</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.iconWrapper}>
            <KakaoIcon size={96} background logoScale={0.55} />
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeLabel}>PRO</Text>
            </View>
          </View>

          <Text style={styles.title}>알림톡으로 참석 요청을{'\n'}놓치지 않게</Text>
          <Text style={styles.subtitle}>
            앱 알림보다 잘 열어보는 카카오 알림톡으로{'\n'}미응답 멤버에게 확실하게 리마인드하세요
          </Text>
        </View>

        <View style={styles.featureCard}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark-outline" size={14} color={colors.text.primary} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeLabel}>첫 달 특가</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>100원</Text>
            <Text style={styles.priceUnit}>첫 달</Text>
            <Text style={styles.priceOriginal}>2,990원</Text>
          </View>
          <Text style={styles.priceHint}>이후 매월 2,990원 · 언제든 해지 가능</Text>
        </View>

        <Button
          label="첫 달 100원으로 시작하기"
          variant="primary"
          onPress={handleStartPress}
          style={styles.startButton}
        />

        <Text style={styles.disclaimer}>
          첫 달 100원, 이후 월 2,990원 자동결제 · 해지 전까지 매월 갱신 · 언제든 해지
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.premiumScreenBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    height: 44,
  },
  restoreLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  content: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  iconWrapper: {
    marginBottom: spacing.lg,
  },
  proBadge: {
    // Figma node 312:27 실제 값: 원형 배경 우상단 모서리에 살짝 걸치는 위치
    position: 'absolute',
    top: 6,
    right: -4,
    paddingLeft: 5,
    paddingRight: 4,
    paddingVertical: 2,
    borderRadius: borderRadius.badge,
    backgroundColor: colors.premiumTitleText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBadgeLabel: {
    ...typography.badge,
    color: colors.premiumGold,
  },
  title: {
    ...typography.heading2,
    textAlign: 'center',
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.captionLarge,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  featureCard: {
    backgroundColor: colors.premiumFeatureCardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureCheck: {
    // Figma node 312:18 실제 값: rounded-10 on 20px box = 완전한 원
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.premiumAccentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...typography.captionLarge,
    color: colors.text.primary,
  },
  priceCard: {
    position: 'relative',
    backgroundColor: colors.premiumAccentSoft,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  priceBadge: {
    // Figma 실제 값: 뱃지가 카드 위쪽 테두리에 걸치도록 배치 (top -9 = 뱃지 높이 18의 절반만큼 테두리 위로)
    position: 'absolute',
    top: -9,
    left: spacing.md,
    height: 18,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadgeLabel: {
    ...typography.badge,
    color: colors.background,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...typography.heading2,
    fontSize: 28,
    color: colors.text.primary,
  },
  priceUnit: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  priceOriginal: {
    ...typography.caption,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginLeft: 'auto',
  },
  priceHint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  startButton: {
    marginTop: spacing.lg,
  },
  disclaimer: {
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.text.disabled,
    marginTop: spacing.sm,
  },
});
