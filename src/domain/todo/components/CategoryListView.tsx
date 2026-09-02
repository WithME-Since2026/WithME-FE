import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ConfirmModal } from '@/common/components/ConfirmModal';
import { spacing } from '@/common/styles/theme';

import { useDeleteCategoryMutation } from '@/domain/todo/hooks/useDeleteCategoryMutation';
import { useUpdateCategoryMutation } from '@/domain/todo/hooks/useUpdateCategoryMutation';
import type { TodoCategoryResponse } from '@/domain/todo/types';

type CategoryListViewProps = {
  categories: TodoCategoryResponse[];
  onClose: () => void;
  onCreate: () => void;
  onEdit: (category: TodoCategoryResponse) => void;
};

// "카테고리" 관리 시트의 목록 화면 (Figma 784-20562) — 편집/삭제와 새 카테고리 추가 진입점을 제공한다
export function CategoryListView({ categories, onClose, onCreate, onEdit }: CategoryListViewProps) {
  const [deleteTarget, setDeleteTarget] = useState<TodoCategoryResponse | null>(null);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();
  const { mutateAsync: updateCategory, isPending: isReordering } = useUpdateCategoryMutation();

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const categoryId = deleteTarget.categoryId;
    setDeleteTarget(null);
    deleteCategory(categoryId);
  };

  // 목록에 보이는 순서(= sortOrder 오름차순) 기준으로 바로 위/아래 카테고리와 sortOrder를 맞바꾼다
  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) {
      return;
    }

    const current = categories[index];
    const target = categories[targetIndex];

    try {
      await Promise.all([
        updateCategory({ categoryId: current.categoryId, sortOrder: target.sortOrder }),
        updateCategory({ categoryId: target.categoryId, sortOrder: current.sortOrder }),
      ]);
    } catch {
      // 에러는 재시도 가능하도록 조용히 무시하고 목록은 이전 순서로 유지된다
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconButton}
          onPress={onClose}
          hitSlop={8}
          accessibilityLabel="닫기"
        >
          <Ionicons name="chevron-back" size={20} color="#1C1B1F" />
        </Pressable>
        <Text style={styles.title}>카테고리</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.listCard}>
          {categories.map((category, index) => (
            <View
              key={category.categoryId}
              style={[styles.row, index === categories.length - 1 && styles.rowLast]}
            >
              <View style={styles.reorderColumn}>
                <Pressable
                  style={styles.reorderButton}
                  onPress={() => handleMove(index, -1)}
                  disabled={index === 0 || isReordering}
                  hitSlop={4}
                  accessibilityLabel={`${category.categoryName} 위로 이동`}
                >
                  <Ionicons
                    name="chevron-up"
                    size={14}
                    color={index === 0 ? '#CAC4D0' : '#79747E'}
                  />
                </Pressable>
                <Pressable
                  style={styles.reorderButton}
                  onPress={() => handleMove(index, 1)}
                  disabled={index === categories.length - 1 || isReordering}
                  hitSlop={4}
                  accessibilityLabel={`${category.categoryName} 아래로 이동`}
                >
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={index === categories.length - 1 ? '#CAC4D0' : '#79747E'}
                  />
                </Pressable>
              </View>
              <View style={[styles.dot, { backgroundColor: category.categoryColor }]} />
              <Text style={styles.name} numberOfLines={1}>
                {category.categoryName}
              </Text>
              <Pressable
                style={styles.editButton}
                onPress={() => onEdit(category)}
                hitSlop={4}
                accessibilityLabel={`${category.categoryName} 수정`}
              >
                <Ionicons name="pencil" size={13} color="#1A73E8" />
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => setDeleteTarget(category)}
                disabled={isDeleting}
                hitSlop={4}
                accessibilityLabel={`${category.categoryName} 삭제`}
              >
                <Ionicons name="trash-outline" size={13} color="#DC2626" />
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable style={styles.addButton} onPress={onCreate}>
          <Ionicons name="add" size={15} color="#1A73E8" />
          <Text style={styles.addButtonText}>새 카테고리 추가</Text>
        </Pressable>
      </View>

      <ConfirmModal
        visible={deleteTarget !== null}
        message={`'${deleteTarget?.categoryName}' 카테고리를 삭제할까요?`}
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1B1F',
  },
  body: {
    paddingHorizontal: spacing.md,
  },
  listCard: {
    borderWidth: 1,
    borderColor: '#E8E0F0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E0F0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  reorderColumn: {
    justifyContent: 'center',
  },
  reorderButton: {
    width: 20,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: '#1C1B1F',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBE9FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    borderRadius: 100,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A73E8',
  },
});
