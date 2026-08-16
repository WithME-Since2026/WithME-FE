import { useEffect, useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';
import { formatMonthLabel, parseDateKey } from '@/common/utils/date';

import { TodoCategoryPickerSheet } from '@/domain/todo/components/TodoCategoryPickerSheet';
import { TodoDatePickerSheet } from '@/domain/todo/components/TodoDatePickerSheet';
import { TodoTimePickerSheet } from '@/domain/todo/components/TodoTimePickerSheet';
import { useCreateTodoMutation } from '@/domain/todo/hooks/useCreateTodoMutation';
import type { TodoCategoryResponse } from '@/domain/todo/types';

type TodoCreateSheetProps = {
  visible: boolean;
  categories: TodoCategoryResponse[];
  initialDateKey: string;
  onClose: () => void;
};

function formatDateRowLabel(dateKey: string) {
  const date = parseDateKey(dateKey);

  return `${formatMonthLabel(date.getFullYear(), date.getMonth() + 1)} ${date.getDate()}일`;
}

// FAB 스피드다이얼의 "새 할 일"에서 열리는 할 일 추가 바텀시트 (Figma 6j 할 일 추가 시트)
export function TodoCreateSheet({
  visible,
  categories,
  initialDateKey,
  onClose,
}: TodoCreateSheetProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dueDateKey, setDueDateKey] = useState(initialDateKey);
  // TODO: BE의 Todo 엔티티에 시간 컬럼이 없어 선택한 시간은 저장되지 않음 (백엔드 API 추천 참고)
  const [timeLabel, setTimeLabel] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  const { mutate: createTodo, isPending, isError } = useCreateTodoMutation();

  useEffect(() => {
    if (visible) {
      setTitle('');
      setCategoryId(null);
      setDueDateKey(initialDateKey);
      setTimeLabel(null);
    }
  }, [visible, initialDateKey]);

  // 닫혀 있을 때도 하위 시트(카테고리/날짜/시간)까지 함께 마운트된 채로 남아있으면 여러 개의
  // <Modal>이 동시에 트리에 존재해 TextInput이 포커스를 못 잡는 문제가 있어 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  const selectedCategory = categories.find((category) => category.categoryId === categoryId);

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
                  <Ionicons name="close" size={16} color={colors.text.secondary} />
                </Pressable>
              </View>

              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="할 일을 입력하세요"
                placeholderTextColor={colors.text.disabled}
                autoFocus
              />
              {isError && (
                <Text style={styles.errorText}>할 일을 추가하지 못했어요. 다시 시도해주세요.</Text>
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

                {/* TODO: 반복 설정 — BE에 todo_repetitions 테이블은 있으나 API가 없어 아직 비활성화 (백엔드 API 추천 참고) */}
                <View style={[styles.row, styles.rowDisabled]}>
                  <View style={styles.rowLeft}>
                    <Ionicons name="repeat-outline" size={18} color={colors.text.disabled} />
                    <Text style={[styles.rowLabel, styles.rowLabelDisabled]}>반복</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowValueMuted}>없음</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  </View>
                </View>
              </View>

              <Button
                label="추가하기"
                onPress={handleSubmit}
                loading={isPending}
                disabled={!title.trim()}
                style={styles.submitButton}
              />
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
    borderColor: colors.primary,
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
  rowDisabled: {
    opacity: 0.6,
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
  rowLabelDisabled: {
    color: colors.text.disabled,
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
  submitButton: {
    marginTop: spacing.lg,
  },
});
