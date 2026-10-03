import { useState } from 'react';

import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type CreateMeetingTextFieldProps = {
  label: string;
  required?: boolean;
  multiline?: boolean;
} & Omit<TextInputProps, 'multiline'>;

export function CreateMeetingTextField({
  label,
  required = false,
  multiline = false,
  ...inputProps
}: CreateMeetingTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required && ' *'}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, isFocused && styles.inputFocused]}
        placeholderTextColor={colors.meeting.placeholderText}
        multiline={multiline}
        {...inputProps}
        onFocus={(event) => {
          setIsFocused(true);
          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          inputProps.onBlur?.(event);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.meeting.strongText,
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.meeting.inputBorder,
    borderRadius: borderRadius.md + 2,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    ...typography.body2,
    color: colors.meeting.strongText,
  },
  inputMultiline: {
    height: 76,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: colors.meeting.primary,
  },
});
