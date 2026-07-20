import { useState } from 'react';

import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type TextFieldProps = {
  label: string;
  // true이면 비밀번호 표시/숨김 토글을 함께 렌더링
  secureToggle?: boolean;
  errorMessage?: string;
} & Omit<TextInputProps, 'secureTextEntry'>;

export function TextField({
  label,
  secureToggle = false,
  errorMessage,
  ...inputProps
}: TextFieldProps) {
  // secureToggle이 true인 필드(비밀번호)만 초기값을 가려진 상태로 시작
  const [isSecure, setIsSecure] = useState(secureToggle);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, errorMessage && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.disabled}
          autoCapitalize="none"
          {...inputProps}
          secureTextEntry={isSecure}
        />
        {secureToggle && (
          <Pressable onPress={() => setIsSecure((prev) => !prev)} hitSlop={8}>
            <Text style={styles.toggleText}>{isSecure ? '표시' : '숨김'}</Text>
          </Pressable>
        )}
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text.primary,
    padding: 0,
  },
  toggleText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
