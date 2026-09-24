import { ReactNode, useState } from 'react';

import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

type TextFieldProps = {
  label: string;
  // true이면 비밀번호 표시/숨김 토글을 함께 렌더링
  secureToggle?: boolean;
  // CVC/카드 비밀번호처럼 토글 없이 항상 마스킹만 필요할 때 사용 (secureToggle과 동시 사용 X)
  secureEntry?: boolean;
  // 인증코드 만료 타이머처럼 입력창 오른쪽에 추가 요소가 필요할 때 사용 (secureToggle과 동시 사용 X)
  rightElement?: ReactNode;
  errorMessage?: string;
  // 결제수단 등록 화면처럼 화면별로 입력창 배경/테두리색을 기본값과 다르게 써야 할 때만 전달
  containerStyle?: StyleProp<ViewStyle>;
  // 결제수단 등록 화면처럼 라벨 폰트 크기를 기본값과 다르게 써야 할 때만 전달
  labelStyle?: StyleProp<TextStyle>;
} & Omit<TextInputProps, 'secureTextEntry'>;

export function TextField({
  label,
  secureToggle = false,
  secureEntry = false,
  rightElement,
  errorMessage,
  containerStyle,
  labelStyle,
  ...inputProps
}: TextFieldProps) {
  // secureToggle이 true인 필드(비밀번호)만 초기값을 가려진 상태로 시작
  const [isSecure, setIsSecure] = useState(secureToggle);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          containerStyle,
          isFocused && styles.inputRowFocused,
          errorMessage && styles.inputRowError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.disabled}
          autoCapitalize="none"
          {...inputProps}
          secureTextEntry={secureEntry || isSecure}
          onFocus={(event) => {
            setIsFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            inputProps.onBlur?.(event);
          }}
        />
        {secureToggle ? (
          <Pressable onPress={() => setIsSecure((prev) => !prev)} hitSlop={8}>
            <Text style={styles.toggleText}>{isSecure ? '표시' : '숨김'}</Text>
          </Pressable>
        ) : (
          rightElement
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputRowFocused: {
    borderColor: colors.primary,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    // lineHeight를 주면 iOS에서 p/y/g 같은 글자의 아래쪽(descender)이 잘려 보이는
    // 문제가 있어 TextInput에는 fontSize/fontWeight만 적용
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
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
