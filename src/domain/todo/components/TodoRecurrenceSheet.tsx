import { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { WEEKDAY_LABELS_KO, parseDateKey } from '@/common/utils/date';

import { TodoDatePickerSheet } from '@/domain/todo/components/TodoDatePickerSheet';
import { createDefaultCustomRecurrence } from '@/domain/todo/constants/recurrence';
import type {
  TodoRecurrenceEnd,
  TodoRecurrenceRule,
  TodoRecurrenceUnit,
} from '@/domain/todo/types';

type EndType = TodoRecurrenceEnd['type'];

const UNIT_OPTIONS: { value: TodoRecurrenceUnit; label: string }[] = [
  { value: 'DAY', label: '일' },
  { value: 'WEEK', label: '주' },
  { value: 'MONTH', label: '개월' },
];

const END_OPTIONS: { value: EndType; label: string }[] = [
  { value: 'NEVER', label: '안 함' },
  { value: 'ON_DATE', label: '날짜 지정' },
  { value: 'AFTER_COUNT', label: '횟수' },
];

function formatEndDateLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function buildRecurrenceEnd(
  endType: EndType,
  endDate: string,
  endCount: string,
): TodoRecurrenceEnd {
  switch (endType) {
    case 'ON_DATE':
      return { type: 'ON_DATE', date: endDate };
    case 'AFTER_COUNT':
      return { type: 'AFTER_COUNT', count: Math.max(1, Number(endCount) || 1) };
    case 'NEVER':
      return { type: 'NEVER' };
  }
}

type TodoRecurrenceSheetProps = {
  visible: boolean;
  // 이미 "맞춤"으로 설정된 규칙이 있으면 이 값으로 초기화하고, 없으면 dueDateKey 기준 기본값을 쓴다
  initialRule: TodoRecurrenceRule | null;
  dueDateKey: string;
  onConfirm: (rule: TodoRecurrenceRule) => void;
  onClose: () => void;
};

// "새 할 일"/"할 일 편집" 시트의 반복 필드에서 "맞춤"을 눌렀을 때 열리는 상세 반복 설정 시트
export function TodoRecurrenceSheet({
  visible,
  initialRule,
  dueDateKey,
  onConfirm,
  onClose,
}: TodoRecurrenceSheetProps) {
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [unit, setUnit] = useState<TodoRecurrenceUnit>('WEEK');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [endType, setEndType] = useState<EndType>('NEVER');
  const [endDate, setEndDate] = useState(dueDateKey);
  const [endCount, setEndCount] = useState('1');
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const base = initialRule ?? createDefaultCustomRecurrence(dueDateKey);

    setRepeatInterval(base.interval);
    setUnit(base.unit);
    setWeekdays(base.weekdays.length > 0 ? base.weekdays : [parseDateKey(dueDateKey).getDay()]);
    setEndType(base.end.type);
    setEndDate(base.end.type === 'ON_DATE' ? base.end.date : dueDateKey);
    setEndCount(String(base.end.type === 'AFTER_COUNT' ? base.end.count : 1));
  }, [visible, initialRule, dueDateKey]);

  // 닫혀 있을 때도 Modal이 계속 마운트되어 있으면 부모 시트의 TextInput이 포커스를 못 잡는 문제가 있어
  // (동시에 여러 개 <Modal>이 트리에 존재) 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  const isWeekly = unit === 'WEEK';
  const isSaveDisabled = isWeekly && weekdays.length === 0;

  const handleToggleWeekday = (day: number) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day].sort(),
    );
  };

  const handleConfirm = () => {
    if (isSaveDisabled) {
      return;
    }

    const end = buildRecurrenceEnd(endType, endDate, endCount);

    onConfirm({
      frequency: 'CUSTOM',
      interval: Math.max(1, repeatInterval),
      unit,
      weekdays: isWeekly ? weekdays : [],
      end,
    });
    onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        {/* 횟수 입력창을 탭해 키보드가 뜨면, 날짜 지정 시트가 항상 화면 위에 그대로 보이는 것처럼
            이 시트도 키보드에 가려지지 않고 위로 올라오도록 한다 */}
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.backdrop} onPress={onClose} />

          <View style={styles.sheetPositioner} pointerEvents="box-none">
            <View style={styles.sheet}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <Pressable
                  style={styles.backButton}
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityLabel="뒤로"
                >
                  <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
                </Pressable>
                <Text style={styles.title}>맞춤 반복</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>반복 주기</Text>
                <View style={styles.intervalRow}>
                  <Text style={styles.everyLabel}>매</Text>
                  <Pressable
                    style={styles.stepperButton}
                    onPress={() => setRepeatInterval((prev) => Math.max(1, prev - 1))}
                    hitSlop={4}
                    accessibilityLabel="주기 줄이기"
                  >
                    <Ionicons name="remove" size={14} color={colors.text.primary} />
                  </Pressable>
                  <Text style={styles.intervalValue}>{repeatInterval}</Text>
                  <Pressable
                    style={styles.stepperButton}
                    onPress={() => setRepeatInterval((prev) => Math.min(99, prev + 1))}
                    hitSlop={4}
                    accessibilityLabel="주기 늘리기"
                  >
                    <Ionicons name="add" size={14} color={colors.text.primary} />
                  </Pressable>

                  <View style={styles.segmentGroup}>
                    {UNIT_OPTIONS.map((option) => {
                      const isSelected = option.value === unit;

                      return (
                        <Pressable
                          key={option.value}
                          style={[styles.segmentButton, isSelected && styles.segmentButtonSelected]}
                          onPress={() => setUnit(option.value)}
                        >
                          <Text
                            style={[styles.segmentLabel, isSelected && styles.segmentLabelSelected]}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>

              {isWeekly && (
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>반복 요일</Text>
                  <View style={styles.weekdayRow}>
                    {WEEKDAY_LABELS_KO.map((label, day) => {
                      const isSelected = weekdays.includes(day);

                      return (
                        <Pressable
                          key={label}
                          style={[styles.weekdayButton, isSelected && styles.weekdayButtonSelected]}
                          onPress={() => handleToggleWeekday(day)}
                          accessibilityLabel={`${label}요일`}
                        >
                          <Text
                            style={[styles.weekdayLabel, isSelected && styles.weekdayLabelSelected]}
                          >
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>종료</Text>
                <View style={styles.endSegmentGroup}>
                  {END_OPTIONS.map((option) => {
                    const isSelected = option.value === endType;

                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.endSegmentButton,
                          isSelected && styles.segmentButtonSelected,
                        ]}
                        onPress={() => setEndType(option.value)}
                      >
                        <Text
                          style={[styles.segmentLabel, isSelected && styles.segmentLabelSelected]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {endType === 'ON_DATE' && (
                  <Pressable
                    style={styles.endDetailRow}
                    onPress={() => setIsEndDatePickerOpen(true)}
                  >
                    <Text style={styles.endDetailValue}>{formatEndDateLabel(endDate)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </Pressable>
                )}

                {endType === 'AFTER_COUNT' && (
                  <View style={styles.countStepperRow}>
                    <Pressable
                      style={styles.stepperButton}
                      onPress={() =>
                        setEndCount((prev) => String(Math.max(1, (Number(prev) || 1) - 1)))
                      }
                      hitSlop={4}
                      accessibilityLabel="횟수 줄이기"
                    >
                      <Ionicons name="remove" size={14} color={colors.text.primary} />
                    </Pressable>
                    <TextInput
                      style={styles.countInput}
                      value={endCount}
                      onChangeText={(text) => setEndCount(text.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      maxLength={3}
                      textAlign="center"
                    />
                    <Pressable
                      style={styles.stepperButton}
                      onPress={() =>
                        setEndCount((prev) => String(Math.min(999, (Number(prev) || 0) + 1)))
                      }
                      hitSlop={4}
                      accessibilityLabel="횟수 늘리기"
                    >
                      <Ionicons name="add" size={14} color={colors.text.primary} />
                    </Pressable>
                  </View>
                )}
              </View>

              <Button
                label="저장"
                onPress={handleConfirm}
                disabled={isSaveDisabled}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TodoDatePickerSheet
        visible={isEndDatePickerOpen}
        selectedDateKey={endDate}
        onConfirm={setEndDate}
        onClose={() => setIsEndDatePickerOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheetPositioner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: '50%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CAC4D0',
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.48,
    color: '#49454F',
  },
  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  everyLabel: {
    ...typography.body2,
    color: colors.text.primary,
    marginRight: 2,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intervalValue: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  segmentGroup: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    overflow: 'hidden',
  },
  // 종료 필드는 intervalRow처럼 가로 flex 컨테이너 안에 있지 않고 column 필드에 바로 들어가기 때문에,
  // segmentGroup의 flex: 1(세로 방향으로 해석됨)을 그대로 쓰면 높이가 0으로 찌그러진다 — 별도 스타일로 분리
  endSegmentGroup: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSegmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: colors.primary,
  },
  segmentLabel: {
    ...typography.body2,
    fontSize: 13,
    color: colors.text.secondary,
  },
  segmentLabelSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekdayButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekdayLabel: {
    ...typography.body2,
    fontSize: 13,
    color: colors.text.primary,
  },
  weekdayLabelSelected: {
    color: colors.background,
    fontWeight: '700',
  },
  endDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: spacing.sm,
  },
  endDetailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  // 반복 주기 행(intervalRow)의 -/+ 스테퍼와 같은 형태: 왼쪽 -, 가운데 숫자 입력창, 오른쪽 +
  countStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  countInput: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    width: 48,
    height: 28,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  confirmButton: {
    // sheet의 minHeight로 생긴 여유 공간을 버튼 위쪽으로 밀어내 버튼을 항상 하단에 고정한다
    marginTop: 'auto',
    borderRadius: borderRadius.full,
  },
});
