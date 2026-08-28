import { useEffect, useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatMonthLabel, parseDateKey } from '@/common/utils/date';

import { TodoDatePickerSheet } from '@/domain/todo/components/TodoDatePickerSheet';
import { TodoTimePickerSheet } from '@/domain/todo/components/TodoTimePickerSheet';
import { useCreateTodoMutation } from '@/domain/todo/hooks/useCreateTodoMutation';
import type { TodoCategoryResponse } from '@/domain/todo/types';

type TodoCreateSheetProps = {
  visible: boolean;
  categories: TodoCategoryResponse[];
  initialDateKey: string;
  onClose: () => void;
  // "+" 칩을 눌렀을 때 카테고리 생성 화면으로 이동시키기 위한 콜백 (내비게이션은 화면 쪽에서 담당)
  onAddCategory: () => void;
};

function formatDateRowLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return `${formatMonthLabel(date.getFullYear(), date.getMonth() + 1)} ${date.getDate()}일`;
}

// FAB 스피드다이얼의 "새 할 일" 및 캘린더 날짜 상세 시트에서 열리는 할 일 추가 바텀시트 (Figma 784-19051)
export function TodoCreateSheet({
  visible,
  categories,
  initialDateKey,
  onClose,
  onAddCategory,
}: TodoCreateSheetProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dueDateKey, setDueDateKey] = useState(initialDateKey);
  const [timeLabel, setTimeLabel] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const { mutate: createTodo, isPending, isError } = useCreateTodoMutation();

  useEffect(() => {
    if (visible) {
      setTitle('');
      setCategoryId(null);
      setDueDateKey(initialDateKey);
      setTimeLabel(null);
    }
  }, [visible, initialDateKey]);

  // 닫혀 있을 때도 하위 시트(날짜/시간)까지 함께 마운트된 채로 남아있으면 여러 개의
  // <Modal>이 동시에 트리에 존재해 TextInput이 포커스를 못 잡는 문제가 있어 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  const handleToggleCategory = (nextCategoryId: number) => {
    setCategoryId((prev) => (prev === nextCategoryId ? null : nextCategoryId));
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    createTodo(
      {
        title: trimmedTitle,
        dueDate: dueDateKey,
        categoryId,
        notificationStatus: false,
        dueTime: timeLabel,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={onClose} />

          <View style={styles.sheetPositioner} pointerEvents="box-none">
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>새 할 일</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityLabel="닫기"
                >
                  <Ionicons name="close" size={16} color={colors.text.primary} />
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>제목</Text>
                  <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="할 일을 입력하세요"
                    placeholderTextColor="rgba(28, 27, 31, 0.5)"
                    autoFocus
                  />
                </View>
                {isError && (
                  <Text style={styles.errorText}>
                    할 일을 추가하지 못했어요. 다시 시도해주세요.
                  </Text>
                )}

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>카테고리</Text>
                  <View style={styles.chipRow}>
                    {categories.map((category) => {
                      const isSelected = category.categoryId === categoryId;

                      return (
                        <Pressable
                          key={category.categoryId}
                          style={[
                            styles.chip,
                            isSelected && {
                              backgroundColor: `${category.categoryColor}14`,
                              borderColor: category.categoryColor,
                            },
                          ]}
                          onPress={() => handleToggleCategory(category.categoryId)}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={12} color={category.categoryColor} />
                          )}
                          <View
                            style={[styles.chipDot, { backgroundColor: category.categoryColor }]}
                          />
                          <Text
                            style={[
                              styles.chipLabel,
                              isSelected && { color: category.categoryColor },
                            ]}
                          >
                            {category.categoryName}
                          </Text>
                        </Pressable>
                      );
                    })}
                    <Pressable
                      style={styles.addChipButton}
                      onPress={onAddCategory}
                      accessibilityLabel="카테고리 추가"
                    >
                      <Ionicons name="add" size={15} color={colors.text.secondary} />
                    </Pressable>
                  </View>
                </View>

                <Pressable style={styles.field} onPress={() => setIsDatePickerOpen(true)}>
                  <Text style={styles.fieldLabel}>날짜</Text>
                  <View style={styles.rowValueLine}>
                    <Text style={styles.rowValue}>{formatDateRowLabel(dueDateKey)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </View>
                </Pressable>

                <Pressable style={styles.field} onPress={() => setIsTimePickerOpen(true)}>
                  <Text style={styles.fieldLabel}>시간</Text>
                  <View style={styles.rowValueLine}>
                    <Text style={timeLabel ? styles.rowValue : styles.rowValueMuted}>
                      {timeLabel ?? '선택 안 함'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
                  </View>
                </Pressable>
              </View>

              <View style={styles.footer}>
                <Pressable style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Button
                  label="저장"
                  onPress={handleSubmit}
                  loading={isPending}
                  disabled={!title.trim()}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <TodoDatePickerSheet
        visible={isDatePickerOpen}
        selectedDateKey={dueDateKey}
        onConfirm={setDueDateKey}
        onClose={() => setIsDatePickerOpen(false)}
      />

      <TodoTimePickerSheet
        visible={isTimePickerOpen}
        initialTime={timeLabel}
        onConfirm={setTimeLabel}
        onClose={() => setIsTimePickerOpen(false)}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  handle: {
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: '#F3EDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGroup: {
    paddingHorizontal: 16,
    gap: spacing.sm,
  },
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
  titleInput: {
    marginTop: spacing.sm,
    padding: 0,
    fontSize: 16,
    color: colors.text.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
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
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#49454F',
  },
  addChipButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CAC4D0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowValueLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  rowValueMuted: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.disabled,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  saveButton: {
    flex: 2,
    borderRadius: borderRadius.full,
  },
});
