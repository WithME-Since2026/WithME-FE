import { useEffect, useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatMonthLabel, parseDateKey } from '@/common/utils/date';

import { TodoCategoryPickerSheet } from '@/domain/todo/components/TodoCategoryPickerSheet';
import { TodoDatePickerSheet } from '@/domain/todo/components/TodoDatePickerSheet';
import { TodoTimePickerSheet } from '@/domain/todo/components/TodoTimePickerSheet';
import { useUpdateTodoDateMutation } from '@/domain/todo/hooks/useUpdateTodoDateMutation';
import { useUpdateTodoMutation } from '@/domain/todo/hooks/useUpdateTodoMutation';
import type { TodoCategoryResponse, TodoResponse } from '@/domain/todo/types';

type TodoEditSheetProps = {
  visible: boolean;
  todo: TodoResponse | null;
  categories: TodoCategoryResponse[];
  onClose: () => void;
};

function formatDateRowLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return `${formatMonthLabel(date.getFullYear(), date.getMonth() + 1)} ${date.getDate()}일`;
}

// 롱프레스 퀵 액션의 "수정"에서 열리는 할 일 편집 바텀시트 (Figma 6d 할 일 편집 팝업)
// 카테고리/날짜/시간 선택기는 "새 할 일" 시트와 동일하게 재사용하고, 디자인의 우선순위 항목은 제외했다
export function TodoEditSheet({ visible, todo, categories, onClose }: TodoEditSheetProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dueDateKey, setDueDateKey] = useState('');
  const [timeLabel, setTimeLabel] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const {
    mutateAsync: updateTodo,
    isPending: isUpdatingTodo,
    isError: isUpdateError,
  } = useUpdateTodoMutation();
  const {
    mutateAsync: updateTodoDate,
    isPending: isUpdatingDate,
    isError: isDateError,
  } = useUpdateTodoDateMutation();
  const isPending = isUpdatingTodo || isUpdatingDate;
  const isError = isUpdateError || isDateError;

  useEffect(() => {
    if (visible && todo) {
      setTitle(todo.title);
      setCategoryId(todo.categoryId);
      setDueDateKey(todo.dueDate);
      setTimeLabel(todo.dueTime ?? null);
    }
  }, [visible, todo]);

  // 닫혀 있을 때도 하위 시트(카테고리/날짜/시간)까지 함께 마운트된 채로 남아있으면 여러 개의
  // <Modal>이 동시에 트리에 존재해 TextInput이 포커스를 못 잡는 문제가 있어 완전히 언마운트한다
  if (!visible || !todo) {
    return null;
  }

  const selectedCategory = categories.find((category) => category.categoryId === categoryId);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      // 제목/카테고리와 날짜/시간은 BE 계획상 서로 다른 엔드포인트(PATCH /todo, PATCH /todo/date)라 나눠 보낸다
      await Promise.all([
        updateTodo({ todoId: todo.todoId, title: trimmedTitle, categoryId }),
        updateTodoDate({
          todoId: todo.todoId,
          dueDate: dueDateKey,
          dueTime: timeLabel,
          isPostponed: false,
        }),
      ]);
      onClose();
    } catch {
      // 에러 메시지는 isError 상태로 화면에 표시된다
    }
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
                <Text style={styles.title}>할 일 편집</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityLabel="닫기"
                >
                  <Ionicons name="close" size={16} color={colors.text.secondary} />
                </Pressable>
              </View>

              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="할 일을 입력하세요"
                placeholderTextColor={colors.text.disabled}
              />
              {isError && (
                <Text style={styles.errorText}>할 일을 수정하지 못했어요. 다시 시도해주세요.</Text>
              )}

              <View style={styles.rowGroup}>
                <Pressable style={styles.row} onPress={() => setIsCategoryPickerOpen(true)}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="folder-outline" size={18} color={colors.text.primary} />
                    <Text style={styles.rowLabel}>카테고리</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowValueAccent}>
                      {selectedCategory ? selectedCategory.categoryName : '없음'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  </View>
                </Pressable>

                <Pressable style={styles.row} onPress={() => setIsDatePickerOpen(true)}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="calendar-outline" size={18} color={colors.text.primary} />
                    <Text style={styles.rowLabel}>날짜</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowValue}>{formatDateRowLabel(dueDateKey)}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  </View>
                </Pressable>

                <Pressable style={styles.row} onPress={() => setIsTimePickerOpen(true)}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="time-outline" size={18} color={colors.text.primary} />
                    <Text style={styles.rowLabel}>시간</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={timeLabel ? styles.rowValue : styles.rowValueMuted}>
                      {timeLabel ?? '선택 안 함'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  </View>
                </Pressable>
              </View>

              <View style={styles.footer}>
                <Button
                  label="취소"
                  variant="outline"
                  onPress={onClose}
                  style={styles.footerButton}
                />
                <Button
                  label="저장"
                  onPress={handleSubmit}
                  loading={isPending}
                  disabled={!title.trim()}
                  style={styles.footerButton}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <TodoCategoryPickerSheet
        visible={isCategoryPickerOpen}
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setIsCategoryPickerOpen(false)}
      />

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
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: borderRadius.sm / 2,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    marginTop: spacing.md,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...typography.body1,
    color: colors.text.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  rowGroup: {
    marginTop: spacing.sm,
    marginHorizontal: -spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  rowValue: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.text.primary,
  },
  rowValueMuted: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  rowValueAccent: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  footerButton: {
    flex: 1,
  },
});
