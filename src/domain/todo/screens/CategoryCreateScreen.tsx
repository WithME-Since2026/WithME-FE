import { useEffect, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/common/components/Button';
import { borderRadius, colors, spacing, typography } from '@/common/styles/theme';

import type { RootStackParamList } from '@/app/navigation';

import {
  CATEGORY_COLOR_PALETTE,
  CategoryColorPalette,
} from '@/domain/todo/components/CategoryColorPalette';
import { useCreateCategoryMutation } from '@/domain/todo/hooks/useCreateCategoryMutation';
import { useTodoCategoriesQuery } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { useUpdateCategoryMutation } from '@/domain/todo/hooks/useUpdateCategoryMutation';

type CategoryCreateScreenProps = NativeStackScreenProps<RootStackParamList, 'CategoryCreate'>;

const BACK_BUTTON_SIZE = 32;

// 카테고리 생성/수정 화면 (Figma 6h 카테고리 생성). route.params.categoryId가 있으면 수정 모드로 동작
export function CategoryCreateScreen({ navigation, route }: CategoryCreateScreenProps) {
  const categoryId = route.params?.categoryId;
  const isEditMode = categoryId !== undefined;

  const { data: categories = [] } = useTodoCategoriesQuery();
  const editingCategory = categories.find((category) => category.categoryId === categoryId);

  const [name, setName] = useState(editingCategory?.categoryName ?? '');
  const [color, setColor] = useState(editingCategory?.categoryColor ?? CATEGORY_COLOR_PALETTE[0]);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.categoryName);
      setColor(editingCategory.categoryColor);
    }
  }, [editingCategory]);

  const {
    mutate: createCategory,
    isPending: isCreating,
    isError: isCreateError,
  } = useCreateCategoryMutation();
  const {
    mutate: updateCategory,
    isPending: isUpdating,
    isError: isUpdateError,
  } = useUpdateCategoryMutation();

  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;

  const trimmedName = name.trim();
  const previewInitial = trimmedName.slice(0, 1) || '?';

  const handleSubmit = () => {
    if (!trimmedName) {
      return;
    }

    if (isEditMode) {
      updateCategory(
        { categoryId, categoryName: trimmedName, categoryColor: color },
        { onSuccess: () => navigation.goBack() },
      );
      return;
    }

    createCategory(
      { categoryName: trimmedName, categoryColor: color },
      { onSuccess: () => navigation.goBack() },
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
        <Text style={styles.headerTitle}>{isEditMode ? '카테고리 수정' : '카테고리 생성'}</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>카테고리 이름</Text>
          <View style={styles.nameInputRow}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="카테고리 이름을 입력하세요"
              placeholderTextColor={colors.text.disabled}
              maxLength={64}
            />
            {name.length > 0 && (
              <Pressable onPress={() => setName('')} hitSlop={8} accessibilityLabel="지우기">
                <View style={styles.clearButton}>
                  <Ionicons name="close" size={12} color={colors.text.secondary} />
                </View>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>색상 선택</Text>
          <CategoryColorPalette value={color} onChange={setColor} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>미리보기</Text>
          <View style={[styles.previewCard, { backgroundColor: `${color}1F`, borderColor: color }]}>
            <View style={[styles.previewAvatar, { backgroundColor: `${color}33` }]}>
              <Text style={[styles.previewAvatarText, { color }]}>{previewInitial}</Text>
            </View>
            <Text style={[styles.previewName, { color }]}>{trimmedName || '카테고리 이름'}</Text>
          </View>
        </View>

        {isError && (
          <Text style={styles.errorText}>
            저장하지 못했어요. 이름이 중복되지 않았는지 확인해주세요.
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isEditMode ? '저장' : '카테고리 생성'}
          onPress={handleSubmit}
          loading={isPending}
          disabled={!trimmedName}
        />
      </View>
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
  headerRightSpacer: {
    width: BACK_BUTTON_SIZE,
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  nameInput: {
    flex: 1,
    ...typography.body2,
    color: colors.text.primary,
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    ...typography.body2,
    fontWeight: '700',
  },
  previewName: {
    ...typography.body1,
    fontWeight: '700',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
