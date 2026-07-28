import { StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing } from '@/common/styles/theme';

import { OnboardingCard } from '@/domain/onboarding/components/OnboardingCard';
import { ONBOARDING_PASTEL, cardShadow } from '@/domain/onboarding/constants/cardStyle';

const ITEMS = [
  { id: 'item-1', checked: true },
  { id: 'item-2', checked: true },
  { id: 'item-3', checked: false },
  { id: 'item-4', checked: false },
];

// "Todo로 준비 완벽하게" 페이지의 카드 일러스트
export function TodoChecklistCard() {
  return (
    <OnboardingCard backgroundColor={ONBOARDING_PASTEL.pink}>
      <View style={styles.list}>
        {ITEMS.map((item) => (
          <View key={item.id} style={styles.row}>
            {item.checked ? (
              <Ionicons name="checkbox" size={18} color={colors.success} />
            ) : (
              <View style={styles.checkboxEmpty} />
            )}
            <View style={[styles.bar, item.checked && styles.barChecked]} />
          </View>
        ))}
      </View>
    </OnboardingCard>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'center',
    width: '68%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.xl,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkboxEmpty: {
    width: 18,
    height: 18,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  bar: {
    flex: 1,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
  },
  barChecked: {
    backgroundColor: colors.success,
    opacity: 0.5,
  },
});
