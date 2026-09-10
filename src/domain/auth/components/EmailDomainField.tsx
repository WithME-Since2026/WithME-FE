import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { Dimensions, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

const PLACEHOLDER_OPTION = '선택';
const DIRECT_INPUT_OPTION = '직접입력';
const DOMAIN_OPTIONS = [
  PLACEHOLDER_OPTION,
  'naver.com',
  'gmail.com',
  'daum.net',
  DIRECT_INPUT_OPTION,
];

type EmailDomainFieldProps = {
  local: string;
  onLocalChange: (value: string) => void;
  domain: string;
  onDomainChange: (value: string) => void;
  errorMessage?: string;
  label?: string;
  // 계정 찾기 화면의 코드발송 버튼처럼, 같은 줄에 이어 붙여야 하는 요소가 있을 때 사용
  actionElement?: ReactNode;
};

// 이메일 입력: [아이디 박스] @ [도메인 선택 박스] (+ 선택적 actionElement) 한 줄에 나란히 배치
// 도메인 박스는 선택된 값을 보여주는 선택 버튼이며, "직접입력" 선택 시에만 텍스트 입력으로 전환됨
export function EmailDomainField({
  local,
  onLocalChange,
  domain,
  onDomainChange,
  errorMessage,
  label = '이메일 입력',
  actionElement,
}: EmailDomainFieldProps) {
  const [isLocalFocused, setIsLocalFocused] = useState(false);
  const [isDomainFocused, setIsDomainFocused] = useState(false);
  const [isManualDomain, setIsManualDomain] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  // 팝업을 도메인 박스 바로 아래에 붙이기 위해 박스의 화면상 위치를 측정해 저장
  const [pickerPosition, setPickerPosition] = useState<{ top: number; right: number } | null>(null);
  // 계정 찾기 화면처럼 같은 줄에 코드발송 버튼이 붙는 경우, 박스 폭을 좁혀 버튼과 함께 한 줄에 들어가게 함
  const isCompact = Boolean(actionElement);

  const domainBoxRef = useRef<View>(null);

  const openPicker = () => {
    domainBoxRef.current?.measureInWindow((x, y, width, height) => {
      setPickerPosition({
        top: y + height + spacing.xs,
        right: Dimensions.get('window').width - (x + width),
      });
      setIsPickerOpen(true);
    });
  };

  const handleSelectDomain = (option: string) => {
    if (option === DIRECT_INPUT_OPTION) {
      setIsManualDomain(true);
      onDomainChange('');
    } else if (option === PLACEHOLDER_OPTION) {
      setIsManualDomain(false);
      onDomainChange('');
    } else {
      setIsManualDomain(false);
      onDomainChange(option);
    }
    setIsPickerOpen(false);
  };

  const isOptionChecked = (option: string) => {
    if (option === DIRECT_INPUT_OPTION) {
      return isManualDomain;
    }
    if (option === PLACEHOLDER_OPTION) {
      return !isManualDomain && domain === '';
    }
    return !isManualDomain && domain === option;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <View
          style={[
            styles.box,
            styles.localBox,
            isCompact && styles.localBoxCompact,
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
          ref={domainBoxRef}
          style={[
            styles.box,
            styles.domainBox,
            isCompact && styles.domainBoxCompact,
            isDomainFocused && styles.boxFocused,
            errorMessage && styles.boxError,
          ]}
        >
          {isManualDomain ? (
            <TextInput
              style={[styles.input, styles.domainInput]}
              placeholder=" 도메인 입력"
              placeholderTextColor={colors.text.disabled}
              value={domain}
              onChangeText={onDomainChange}
              autoCapitalize="none"
              onFocus={() => setIsDomainFocused(true)}
              onBlur={() => setIsDomainFocused(false)}
            />
          ) : (
            <Pressable style={styles.domainValueArea} onPress={openPicker} hitSlop={8}>
              <Text
                style={[
                  styles.domainValueText,
                  styles.domainInput,
                  !domain && styles.domainPlaceholderText,
                ]}
                numberOfLines={1}
              >
                {domain || PLACEHOLDER_OPTION}
              </Text>
            </Pressable>
          )}

          <Pressable onPress={openPicker} hitSlop={8}>
            <Ionicons name="chevron-down" size={14} color={colors.text.secondary} />
          </Pressable>
        </View>

        {actionElement}
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Modal visible={isPickerOpen} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setIsPickerOpen(false)}>
          {pickerPosition && (
            <View
              style={[styles.dropdown, { top: pickerPosition.top, right: pickerPosition.right }]}
            >
              {DOMAIN_OPTIONS.map((option, index) => {
                const checked = isOptionChecked(option);
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.dropdownOption,
                      index === DOMAIN_OPTIONS.length - 1 && styles.dropdownOptionLast,
                    ]}
                    onPress={() => handleSelectDomain(option)}
                  >
                    <Text
                      style={[styles.dropdownOptionText, checked && styles.dropdownOptionChecked]}
                    >
                      {checked ? `✓ ${option}` : option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
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
  localBoxCompact: {
    flex: 1,
  },
  domainBox: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs / 2,
    borderColor: colors.border,
  },
  domainBoxCompact: {
    flex: 1,
  },
  domainValueArea: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  domainValueText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  domainPlaceholderText: {
    color: colors.text.secondary,
  },
  // 도메인 박스 텍스트를 살짝 오른쪽으로 밀어 좌측 여백을 더 줌
  domainInput: {
    marginLeft: spacing.xs,
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
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  backdrop: {
    flex: 1,
  },
  // 사진 속 도메인 옵션 목록처럼 반투명 검정색 팝업으로 도메인 박스 아래에 고정
  dropdown: {
    position: 'absolute',
    minWidth: 132,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    ...typography.body2,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownOptionChecked: {
    color: colors.background,
    fontWeight: '600',
  },
});
