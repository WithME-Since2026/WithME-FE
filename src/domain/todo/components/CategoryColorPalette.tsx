import { Pressable, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, spacing } from '@/common/styles/theme';

// 카테고리 생성/수정 화면에서 고를 수 있는 색상 목록. 기존 카테고리 4색(업무/개인/운동/학습) + 신규 6색
export const CATEGORY_COLOR_PALETTE = [
  '#4A90FA',
  '#33B96B',
  '#F28C1A',
  '#8C33E0',
  '#EB4747',
  '#17A2B8',
  '#F2C94C',
  '#9CA3AF',
  '#FF7A9C',
  '#B08968',
];

const SWATCH_SIZE = 40;
const SLOT_SIZE = 48;

type CategoryColorPaletteProps = {
  value: string;
  onChange: (color: string) => void;
};

// 색상 선택 그리드 (Figma 6h 카테고리 생성 "색상 선택")
export function CategoryColorPalette({ value, onChange }: CategoryColorPaletteProps) {
  return (
    <View style={styles.grid}>
      {CATEGORY_COLOR_PALETTE.map((color) => {
        const isSelected = color.toLowerCase() === value.toLowerCase();

        return (
          <Pressable
            key={color}
            style={styles.slot}
            onPress={() => onChange(color)}
            accessibilityRole="button"
            accessibilityLabel={`색상 ${color}`}
            accessibilityState={{ selected: isSelected }}
          >
            {isSelected && <View style={[styles.halo, { backgroundColor: `${color}26` }]} />}
            <View
              style={[
                styles.swatch,
                { backgroundColor: color },
                isSelected && styles.swatchSelected,
              ]}
            >
              {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    borderRadius: borderRadius.full,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    width: SWATCH_SIZE - 8,
    height: SWATCH_SIZE - 8,
  },
});
