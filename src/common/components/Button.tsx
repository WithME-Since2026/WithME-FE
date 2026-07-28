import type { ReactNode } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type ButtonVariant = 'primary' | 'outline' | 'kakao';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  // 아이디 옆 중복확인 버튼처럼 폭을 좁혀 배치해야 할 때만 전달
  style?: StyleProp<ViewStyle>;
  // 카카오 버튼의 말풍선 아이콘처럼 라벨 앞에 붙는 아이콘
  icon?: ReactNode;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'kakao' ? colors.kakaoText : colors.background} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, labelVariantStyles[variant]]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.body1,
    fontWeight: '600',
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kakao: {
    backgroundColor: colors.kakao,
  },
});

const labelVariantStyles = StyleSheet.create({
  primary: {
    color: colors.background,
  },
  outline: {
    color: colors.text.primary,
  },
  kakao: {
    color: colors.kakaoText,
  },
});
