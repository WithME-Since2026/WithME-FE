import { useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

const DOMAIN_OPTIONS = ['naver.com', 'gmail.com', 'daum.net', 'kakao.com', 'nate.com', '직접입력'];

type EmailDomainFieldProps = {
  local: string;
  onLocalChange: (value: string) => void;
  domain: string;
  onDomainChange: (value: string) => void;
  errorMessage?: string;
};

// 회원가입 이메일 입력: [아이디 박스] @ [도메인 박스] [선택 박스] 3개의 분리된 박스로 구성
export function EmailDomainField({
  local,
  onLocalChange,
  domain,
  onDomainChange,
  errorMessage,
}: EmailDomainFieldProps) {
  const [isLocalFocused, setIsLocalFocused] = useState(false);
  const [isDomainFocused, setIsDomainFocused] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelectDomain = (option: string) => {
    if (option !== '직접입력') {
      onDomainChange(option);
    }
    setIsPickerOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이메일 입력</Text>
      <View style={styles.row}>
        <View
          style={[
            styles.box,
            styles.localBox,
            isLocalFocused && styles.boxFocused,
            errorMessage && styles.boxError,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="이메일 주소"
            placeholderTextColor={colors.text.disabled}
            value={local}
            onChangeText={onLocalChange}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setIsLocalFocused(true)}
            onBlur={() => setIsLocalFocused(false)}
          />
        </View>

        <Text style={styles.at}>@</Text>

        <View
          style={[
            styles.box,
            styles.domainBox,
            isDomainFocused && styles.boxFocused,
            errorMessage && styles.boxError,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholderTextColor={colors.text.disabled}
            value={domain}
            onChangeText={onDomainChange}
            autoCapitalize="none"
            onFocus={() => setIsDomainFocused(true)}
            onBlur={() => setIsDomainFocused(false)}
          />
        </View>

        <Pressable
          style={[styles.box, styles.selectBox]}
          onPress={() => setIsPickerOpen(true)}
          hitSlop={8}
        >
          <Text style={styles.selectButtonText}>선택</Text>
          <Ionicons name="chevron-down" size={14} color={colors.text.secondary} />
        </Pressable>
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Modal visible={isPickerOpen} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setIsPickerOpen(false)}>
          <View style={styles.sheet}>
            {DOMAIN_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                onPress={() => handleSelectDomain(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  box: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localBox: {
    flex: 1.4,
  },
  domainBox: {
    flex: 1,
  },
  selectBox: {
    width: 76,
    flexDirection: 'row',
    gap: spacing.xs / 2,
    borderColor: colors.border,
  },
  boxFocused: {
    borderColor: colors.primary,
  },
  boxError: {
    borderColor: colors.error,
  },
  input: {
    width: '100%',
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    color: colors.text.primary,
    padding: 0,
  },
  at: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  selectButtonText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionText: {
    ...typography.body1,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
