import { useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { WithdrawStepHeader } from '@/domain/mypage/components/WithdrawStepHeader';

type WithdrawReasonScreenProps = NativeStackScreenProps<RootStackParamList, 'WithdrawReason'>;

const WITHDRAW_REASONS = [
  '모임을 더 이상 하지 않아요',
  '알림이 너무 많아요',
  '쓰기 어렵고 복잡해요',
  '기능이 부족해요',
  '다른 앱을 쓰기로 했어요',
  '기타',
];

// 회원 탈퇴 2/3: 탈퇴 이유를 선택(선택 사항)하고 추가 의견을 남기는 화면 (Figma node 884:20)
export function WithdrawReasonScreen({ navigation }: WithdrawReasonScreenProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detail, setDetail] = useState('');

  const handleNextPress = () => {
    navigation.navigate('WithdrawConfirm', { reason: selectedReason ?? undefined, detail });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <WithdrawStepHeader step={2} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>떠나시는 이유를{'\n'}알려주실 수 있나요?</Text>
          <Text style={styles.subtitle}>선택하지 않고 넘어가도 됩니다.</Text>
        </View>

        <View style={styles.optionCard}>
          {WITHDRAW_REASONS.map((reason, index) => {
            const isSelected = selectedReason === reason;

            return (
              <View key={reason}>
                <Pressable
                  style={styles.optionRow}
                  onPress={() => setSelectedReason(reason)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text style={styles.optionLabel}>{reason}</Text>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isSelected ? colors.primary : colors.neutralBorder}
                  />
                </Pressable>
                {index < WITHDRAW_REASONS.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        <TextInput
          style={styles.detailInput}
          placeholder="더 하고 싶은 말이 있다면 적어주세요 (선택)"
          placeholderTextColor={colors.text.disabled}
          value={detail}
          onChangeText={setDetail}
          multiline
        />

        <Pressable style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonLabel}>다음</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading2,
    fontSize: 22,
    color: colors.textStrong,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  optionCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    // Figma 실제 값: 0px 2px 8px rgba(0,0,0,0.05)
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  optionLabel: {
    ...typography.body1,
    fontSize: 15,
    color: colors.textStrong,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  detailInput: {
    marginTop: spacing.md,
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body2,
    fontSize: 13,
    color: colors.text.primary,
    textAlignVertical: 'top',
  },
  nextButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  nextButtonLabel: {
    ...typography.body1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
  },
});
