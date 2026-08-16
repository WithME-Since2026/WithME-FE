import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { TodoCategoryResponse } from '@/domain/todo/types';

type TodoCategoryPickerSheetProps = {
  visible: boolean;
  categories: TodoCategoryResponse[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number | null) => void;
  onClose: () => void;
};

// "새 할 일" 시트의 카테고리 행에서 열리는 단일 선택 바텀시트 (Figma에 전용 화면이 없어 기존 시트 스타일에 맞춰 구성)
export function TodoCategoryPickerSheet({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose,
}: TodoCategoryPickerSheetProps) {
  const handleSelect = (categoryId: number | null) => {
    onSelect(categoryId);
    onClose();
  };

  // 닫혀 있을 때도 Modal이 계속 마운트되어 있으면 부모 시트(TodoCreateSheet)의 TextInput이
  // 포커스를 못 잡는 문제가 있어(동시에 여러 개 <Modal>이 트리에 존재), 완전히 언마운트한다
  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetPositioner} pointerEvents="box-none">
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>카테고리 선택</Text>
              <Pressable
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={8}
                accessibilityLabel="닫기"
              >
                <Ionicons name="close" size={16} color={colors.text.secondary} />
              </Pressable>
            </View>

            <Pressable style={styles.row} onPress={() => handleSelect(null)}>
              <View style={styles.rowLeft}>
                <View style={[styles.colorDot, { backgroundColor: colors.text.disabled }]} />
                <Text style={styles.rowLabel}>없음</Text>
              </View>
              {selectedCategoryId === null && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </Pressable>

            {categories.map((category) => {
              const isSelected = category.categoryId === selectedCategoryId;

              return (
                <Pressable
                  key={category.categoryId}
                  style={styles.row}
                  onPress={() => handleSelect(category.categoryId)}
                >
                  <View style={styles.rowLeft}>
                    <View style={[styles.colorDot, { backgroundColor: category.categoryColor }]} />
                    <Text style={styles.rowLabel}>{category.categoryName}</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  rowLabel: {
    ...typography.body1,
    color: colors.text.primary,
  },
});
