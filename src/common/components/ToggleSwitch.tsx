import { Pressable, StyleSheet, View } from 'react-native';

import { borderRadius, colors } from '@/common/styles/theme';

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// Figma M3Switch를 그대로 옮긴 커스텀 토글 (RN 기본 Switch는 OFF 상태의 아웃라인 표현이 안 돼 직접 구현)
export function ToggleSwitch({ value, onValueChange }: ToggleSwitchProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
  trackOff: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  thumb: {
    position: 'absolute',
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  thumbOn: {
    width: 24,
    height: 24,
    left: 24,
    backgroundColor: colors.background,
  },
  thumbOff: {
    width: 16,
    height: 16,
    left: 6,
    backgroundColor: colors.outlineVariant,
  },
});
