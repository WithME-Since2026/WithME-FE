import { StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing } from '@/common/styles/theme';

const ITEMS = [
  { id: 'item-1', checked: true },
  { id: 'item-2', checked: true },
  { id: 'item-3', checked: false },
  { id: 'item-4', checked: false },
];

// "Todo로 준비 완벽하게" 페이지의 카드 일러스트
export function TodoChecklistCard() {
  return (
    <View style={styles.card}>
      <View style={styles.list}>
        {ITEMS.map((item) => (
          <View key={item.id} style={styles.row}>
            {item.checked ? (
              <Ionicons name="checkbox" size={20} color={colors.success} />
            ) : (
              <View style={styles.checkboxEmpty} />
            )}
            <View style={[styles.bar, item.checked && styles.barChecked]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: '65%',
    backgroundColor: colors.pastel.pink,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  list: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkboxEmpty: {
    width: 20,
    height: 20,
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
