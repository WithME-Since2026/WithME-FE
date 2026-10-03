import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/common/styles/theme';

import {
  createMonthlyRecurrence,
  createWeeklyRecurrence,
  formatRecurrenceSummary,
} from '@/domain/todo/constants/recurrence';
import type { TodoRecurrenceRule } from '@/domain/todo/types';

type TodoRecurrenceChipRowProps = {
  recurrence: TodoRecurrenceRule | null;
  dueDateKey: string;
  onChange: (recurrence: TodoRecurrenceRule | null) => void;
  // "맞춤" 칩을 눌렀을 때 TodoRecurrenceSheet를 여는 건 부모 시트가 담당한다
  onOpenCustom: () => void;
};

// "새 할 일"/"할 일 편집" 시트에 동일하게 들어가는 반복 선택 필드(안 함/매주/매월/맞춤).
// 두 시트에 그대로 중복돼 있던 UI를 공통 컴포넌트로 뺐다
export function TodoRecurrenceChipRow({
  recurrence,
  dueDateKey,
  onChange,
  onOpenCustom,
}: TodoRecurrenceChipRowProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>반복</Text>
      <View style={styles.chipRow}>
        <Pressable
          style={[styles.chip, styles.recurrenceChip, !recurrence && styles.recurrenceChipSelected]}
          onPress={() => onChange(null)}
        >
          <Text style={[styles.chipLabel, !recurrence && styles.recurrenceChipLabelSelected]}>
            안 함
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.chip,
            styles.recurrenceChip,
            recurrence?.frequency === 'WEEKLY' && styles.recurrenceChipSelected,
          ]}
          onPress={() => onChange(createWeeklyRecurrence(dueDateKey))}
        >
          <Text
            style={[
              styles.chipLabel,
              recurrence?.frequency === 'WEEKLY' && styles.recurrenceChipLabelSelected,
            ]}
          >
            매주
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.chip,
            styles.recurrenceChip,
            recurrence?.frequency === 'MONTHLY' && styles.recurrenceChipSelected,
          ]}
          onPress={() => onChange(createMonthlyRecurrence())}
        >
          <Text
            style={[
              styles.chipLabel,
              recurrence?.frequency === 'MONTHLY' && styles.recurrenceChipLabelSelected,
            ]}
          >
            매월
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.chip,
            styles.recurrenceChip,
            recurrence?.frequency === 'CUSTOM' && styles.recurrenceChipSelected,
          ]}
          onPress={onOpenCustom}
        >
          <Text
            style={[
              styles.chipLabel,
              recurrence?.frequency === 'CUSTOM' && styles.recurrenceChipLabelSelected,
            ]}
          >
            {recurrence?.frequency === 'CUSTOM' ? formatRecurrenceSummary(recurrence) : '맞춤'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.48,
    color: '#49454F',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 5,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    color: '#49454F',
    // Android는 폰트 자체에 상하 여백(font padding)이 붙어 텍스트가 배경 박스 중앙에서 아래로
    // 밀려 보인다 — 안 함/매주/매월/맞춤 칩처럼 텍스트 한 줄만 있는 버튼에서 특히 도드라짐
    includeFontPadding: false,
  },
  // chip은 카테고리 칩(점+체크 아이콘이 앞에 붙는)에 맞춘 비대칭 좌우 패딩(paddingLeft/paddingRight)이라,
  // paddingHorizontal로는 덮어써지지 않는다 — RN(Yoga)이 paddingLeft/paddingRight 같은 구체적인
  // 값을 paddingHorizontal보다 항상 우선하기 때문에 반드시 같은 이름(paddingLeft/paddingRight)으로 덮어써야 한다
  recurrenceChip: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  recurrenceChipSelected: {
    backgroundColor: `${colors.primary}14`,
    borderColor: colors.primary,
  },
  recurrenceChipLabelSelected: {
    color: colors.primary,
  },
});
