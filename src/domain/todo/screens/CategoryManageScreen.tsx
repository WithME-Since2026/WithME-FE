import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/common/components/ErrorView';
import { LoadingView } from '@/common/components/LoadingView';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import { CategoryDeleteIcon } from '@/domain/todo/components/CategoryDeleteIcon';
import { CategoryEditIcon } from '@/domain/todo/components/CategoryEditIcon';
import { useDeleteCategoryMutation } from '@/domain/todo/hooks/useDeleteCategoryMutation';
import { useTodoCategoriesQuery } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { useUpdateCategoryMutation } from '@/domain/todo/hooks/useUpdateCategoryMutation';

type CategoryManageScreenProps = NativeStackScreenProps<RootStackParamList, 'CategoryManage'>;

const BACK_BUTTON_SIZE = 32;

// 카테고리 관리 화면 (Figma 6i 카테고리 수정). Figma는 드래그로 순서를 바꾸지만
// 프로젝트에 드래그 정렬 라이브러리가 없어 위/아래 버튼으로 대체 구현
export function CategoryManageScreen({ navigation }: CategoryManageScreenProps) {
  const { data: categories = [], isLoading, isError } = useTodoCategoriesQuery();
  const { mutate: updateCategory } = useUpdateCategoryMutation();
  const { mutate: deleteCategory } = useDeleteCategoryMutation();

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) {
      return;
    }

    updateCategory({ categoryId: categories[index].categoryId, sortOrder: targetIndex });
  };

  const handleDelete = (categoryId: number, categoryName: string) => {
    Alert.alert(
      '카테고리를 삭제할까요?',
      `"${categoryName}" 카테고리를 삭제하면 되돌릴 수 없어요.`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => deleteCategory(categoryId) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={8}
          accessibilityLabel="뒤로가기"
        >
          <Ionicons name="arrow-back" size={18} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>카테고리 관리</Text>
        <Pressable style={styles.doneButton} onPress={() => navigation.goBack()}>
          <Text style={styles.doneButtonText}>완료</Text>
        </Pressable>
      </View>

      {isLoading && <LoadingView />}
      {isError && <ErrorView message="카테고리를 불러오지 못했습니다." />}

      {!isLoading && !isError && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.list}>
            {categories.map((category, index) => (
              <View key={category.categoryId} style={styles.row}>
                <View style={styles.moveButtons}>
                  <Pressable
                    onPress={() => handleMove(index, -1)}
                    disabled={index === 0}
                    hitSlop={4}
                    accessibilityLabel="위로 이동"
                  >
                    <Ionicons
                      name="chevron-up"
                      size={14}
                      color={index === 0 ? colors.text.disabled : colors.text.secondary}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMove(index, 1)}
                    disabled={index === categories.length - 1}
                    hitSlop={4}
                    accessibilityLabel="아래로 이동"
                  >
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color={
                        index === categories.length - 1
                          ? colors.text.disabled
                          : colors.text.secondary
                      }
                    />
                  </Pressable>
                </View>

                <View style={[styles.avatar, { backgroundColor: `${category.categoryColor}33` }]}>
                  <Text style={[styles.avatarText, { color: category.categoryColor }]}>
                    {category.categoryName.slice(0, 1)}
                  </Text>
                </View>

                <View style={styles.rowInfo}>
                  <Text style={styles.categoryName}>{category.categoryName}</Text>
                  <Text style={styles.categoryCount}>{category.todoCount}개의 할 일</Text>
                </View>

                <Pressable
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate('CategoryCreate', { categoryId: category.categoryId })
                  }
                  hitSlop={4}
                  accessibilityLabel={`${category.categoryName} 수정`}
                >
                  <CategoryEditIcon size={16} color={colors.text.secondary} />
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(category.categoryId, category.categoryName)}
                  hitSlop={4}
                  accessibilityLabel={`${category.categoryName} 삭제`}
                >
                  <CategoryDeleteIcon size={16} color={colors.error} />
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => navigation.navigate('CategoryCreate', undefined)}
          >
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>새 카테고리 추가</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  doneButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}1A`,
  },
  doneButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  list: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  moveButtons: {
    alignItems: 'center',
    gap: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.body1,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  categoryName: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryCount: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  addButtonText: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.primary,
  },
});
