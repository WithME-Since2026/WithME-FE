import { useEffect, useState } from 'react';

import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/common/styles/theme';

import { CategoryFormView } from '@/domain/todo/components/CategoryFormView';
import { CategoryListView } from '@/domain/todo/components/CategoryListView';
import type { TodoCategoryResponse } from '@/domain/todo/types';

type CategoryManageSheetProps = {
  visible: boolean;
  categories: TodoCategoryResponse[];
  onClose: () => void;
};

type ManageView = 'list' | 'form';

// 카테고리 목록/생성/수정을 한 바텀시트 안에서 오가는 관리 플로우 (Figma 784-20562, 784-21604, 784-21292).
// TodoCreateSheet/TodoEditSheet의 "+" 카테고리 칩에서 진입한다
export function CategoryManageSheet({ visible, categories, onClose }: CategoryManageSheetProps) {
  const [view, setView] = useState<ManageView>('list');
  const [editingCategory, setEditingCategory] = useState<TodoCategoryResponse | null>(null);

  useEffect(() => {
    if (visible) {
      setView('list');
      setEditingCategory(null);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleCreate = () => {
    setEditingCategory(null);
    setView('form');
  };

  const handleEdit = (category: TodoCategoryResponse) => {
    setEditingCategory(category);
    setView('form');
  };

  const handleFormSuccess = () => {
    setView('list');
    setEditingCategory(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetPositioner} pointerEvents="box-none">
          <View style={styles.sheet}>
            <View style={styles.handle} />

            {view === 'list' ? (
              <CategoryListView
                categories={categories}
                onClose={onClose}
                onCreate={handleCreate}
                onEdit={handleEdit}
              />
            ) : (
              <CategoryFormView
                mode={editingCategory ? 'edit' : 'create'}
                category={editingCategory}
                onBack={() => setView('list')}
                onSuccess={handleFormSuccess}
              />
            )}
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
});
