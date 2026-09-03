import { useState } from 'react';

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { Toast } from '@/common/components/Toast';
import { colors, spacing } from '@/common/styles/theme';
import { addDays, formatDateKey } from '@/common/utils/date';

import { CALENDAR_LAYER_COLORS } from '@/domain/calendar/constants/calendarLayers';
import { useDeleteTodoMutation } from '@/domain/todo/hooks/useDeleteTodoMutation';
import { useUpdateTodoDateMutation } from '@/domain/todo/hooks/useUpdateTodoDateMutation';
import type { TodoResponse } from '@/domain/todo/types';

type TodoQuickActionSheetProps = {
  visible: boolean;
  todo: TodoResponse | null;
  onClose: () => void;
  // "할 일 편집" 항목을 눌렀을 때 편집 시트를 여는 건 화면(CalendarScreen)이 담당한다
  onEditTodo: () => void;
};

// 이 팝업(Figma 784-22833)만의 Material 톤 컬러. 앱 전역 theme에는 없어 로컬로 정의함
const HANDLE_COLOR = '#CAC4D0';
const OUTLINE_VARIANT = '#E8E0F0';
const OUTLINE = '#79747E';
const ON_SURFACE = '#1C1B1F';
const ON_SURFACE_VARIANT = '#49454F';
const TODAY_COLOR = '#1A73E8';
const NEXT_WEEK_COLOR = '#16A34A';

// 캘린더 날짜 상세 시트의 "⋯"에서 열리는 빠른 날짜 변경 팝업 (Figma 784-22833)
export function TodoQuickActionSheet({
  visible,
  todo,
  onClose,
  onEditTodo,
}: TodoQuickActionSheetProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const { mutate: updateTodoDate } = useUpdateTodoDateMutation();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodoMutation();

  const handlePostpone = (dueDateKey: string, toastLabel: string) => {
    if (!todo) {
      return;
    }

    updateTodoDate(
      {
        todoId: todo.todoId,
        dueDate: dueDateKey,
        dueTime: todo.dueTime ?? null,
        isPostponed: true,
      },
      { onSuccess: () => setToastMessage(toastLabel) },
    );
    onClose();
  };

  const handleToday = () => handlePostpone(formatDateKey(new Date()), '오늘로 이동했어요');
  const handleTomorrow = () =>
    handlePostpone(formatDateKey(addDays(new Date(), 1)), '내일로 미루었어요');
  const handleNextWeek = () =>
    handlePostpone(formatDateKey(addDays(new Date(), 7)), '다음 주로 미루었어요');

  const handleConfirmDelete = () => {
    if (!todo) {
      return;
    }

    setIsDeleteConfirmVisible(false);
    deleteTodo(todo.todoId, { onSuccess: onClose });
  };

  return (
    <>
      {visible && todo && (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
          <Pressable style={styles.backdrop} onPress={onClose}>
            <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
              <View style={styles.dragHandleRow}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.header}>
                <Text style={styles.eyebrow}>빠른 날짜 변경 및 편집</Text>
                <Text style={styles.title} numberOfLines={1}>
                  {todo.title}
                </Text>
              </View>

              <Pressable style={styles.row} onPress={handleToday}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(26, 115, 232, 0.08)' }]}>
                  <Ionicons name="calendar-outline" size={20} color={TODAY_COLOR} />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowLabel}>오늘 하기</Text>
                  <Text style={styles.rowSubLabel}>오늘 날짜로 이동</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={OUTLINE} />
              </Pressable>

              <Pressable style={styles.row} onPress={handleTomorrow}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(217, 119, 6, 0.08)' }]}>
                  <Ionicons
                    name="play-skip-forward-outline"
                    size={18}
                    color={CALENDAR_LAYER_COLORS.TODO}
                  />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowLabel}>내일로 미루기</Text>
                  <Text style={styles.rowSubLabel}>하루 뒤로 이동</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={OUTLINE} />
              </Pressable>

              <Pressable style={styles.row} onPress={handleNextWeek}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(22, 163, 74, 0.08)' }]}>
                  <Ionicons name="play-forward-outline" size={18} color={NEXT_WEEK_COLOR} />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowLabel}>다음 주로 미루기</Text>
                  <Text style={styles.rowSubLabel}>7일 뒤로 이동</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={OUTLINE} />
              </Pressable>

              <Pressable style={styles.row} onPress={onEditTodo}>
                <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}14` }]}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </View>
                <Text style={styles.editLabel}>할 일 편집</Text>
              </Pressable>

              {/* 할 일 편집 화면에 있던 삭제 버튼을 그대로 옮겨온 것 — 아이콘 없이 빨간 텍스트만 */}
              <Pressable
                style={styles.deleteButton}
                onPress={() => setIsDeleteConfirmVisible(true)}
                disabled={isDeleting}
                hitSlop={8}
              >
                <Text style={styles.deleteButtonText}>할 일 삭제</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      <Toast
        visible={toastMessage !== null}
        message={toastMessage ?? ''}
        onClose={() => setToastMessage(null)}
      />

      <ConfirmModal
        visible={isDeleteConfirmVisible}
        message="할 일을 정말 삭제하실건가요?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 16,
  },
  dragHandleRow: {
    alignItems: 'center',
    paddingTop: 10,
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: HANDLE_COLOR,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: OUTLINE_VARIANT,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16.5,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    color: ON_SURFACE_VARIANT,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: ON_SURFACE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextGroup: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5,
    color: ON_SURFACE,
  },
  rowSubLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: ON_SURFACE_VARIANT,
  },
  editLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
});
