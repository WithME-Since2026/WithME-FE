import { useEffect, useState } from 'react';

import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { getApiErrorMessage } from '@/common/api/apiError';
import { Button } from '@/common/components/Button';
import { spacing } from '@/common/styles/theme';

import { CATEGORY_COLOR_PALETTE } from '@/domain/todo/constants/categoryColors';
import { useCreateCategoryMutation } from '@/domain/todo/hooks/useCreateCategoryMutation';
import { useUpdateCategoryMutation } from '@/domain/todo/hooks/useUpdateCategoryMutation';
import type { TodoCategoryResponse } from '@/domain/todo/types';

const DEFAULT_COLOR = CATEGORY_COLOR_PALETTE[0];

type CategoryFormViewProps = {
  mode: 'create' | 'edit';
  category: TodoCategoryResponse | null;
  onBack: () => void;
  onSuccess: () => void;
};

// "카테고리" 관리 시트의 생성/수정 화면 (Figma 784-21604 "새 카테고리" / 784-21292 "카테고리 수정")
export function CategoryFormView({ mode, category, onBack, onSuccess }: CategoryFormViewProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(DEFAULT_COLOR);

  const {
    mutate: createCategory,
    isPending: isCreating,
    isError: isCreateError,
    error: createError,
  } = useCreateCategoryMutation();
  const {
    mutate: updateCategory,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateCategoryMutation();
  const isPending = isCreating || isUpdating;
  const isError = isCreateError || isUpdateError;
  // BE가 이름 중복(DUPLICATE_CATEGORY_NAME)/정렬 충돌(CATEGORY_ORDER_CONFLICT) 등 구체적인
  // message를 내려주므로, 있으면 그대로 보여주고 없을 때만 아래 기본 문구로 대체한다
  const errorMessage = getApiErrorMessage(
    createError ?? updateError,
    '카테고리를 저장하지 못했어요. 다시 시도해주세요.',
  );

  useEffect(() => {
    setName(category?.categoryName ?? '');
    setColor(category?.categoryColor ?? DEFAULT_COLOR);
  }, [category]);

  const trimmedName = name.trim();
  const previewName = trimmedName || (mode === 'create' ? '이름 입력' : category?.categoryName);

  const handleSubmit = () => {
    if (!trimmedName) {
      return;
    }

    if (mode === 'create') {
      createCategory({ categoryName: trimmedName, categoryColor: color }, { onSuccess });
      return;
    }

    if (!category) {
      return;
    }

    updateCategory(
      { categoryId: category.categoryId, categoryName: trimmedName, categoryColor: color },
      { onSuccess },
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconButton}
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="뒤로"
        >
          <Ionicons name="chevron-back" size={20} color="#1C1B1F" />
        </Pressable>
        <Text style={styles.title}>{mode === 'create' ? '새 카테고리' : '카테고리 수정'}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.previewRow}>
          <View style={[styles.previewChip, { backgroundColor: `${color}1A`, borderColor: color }]}>
            <View style={[styles.previewDot, { backgroundColor: color }]} />
            <Text style={[styles.previewText, { color }]}>{previewName}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>이름</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="카테고리 이름"
            placeholderTextColor="rgba(28, 27, 31, 0.5)"
            autoFocus
          />
        </View>

        {isError && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>색상</Text>
          <View style={styles.colorRow}>
            {CATEGORY_COLOR_PALETTE.map((swatch) => {
              const isSelected = swatch === color;

              return (
                <Pressable
                  key={swatch}
                  style={[
                    styles.swatch,
                    { backgroundColor: swatch },
                    isSelected && styles.swatchSelected,
                  ]}
                  onPress={() => setColor(swatch)}
                  accessibilityLabel={`색상 ${swatch}`}
                />
              );
            })}
          </View>
        </View>

        <Button
          label={mode === 'create' ? '추가하기' : '수정하기'}
          onPress={handleSubmit}
          loading={isPending}
          disabled={!trimmedName}
          style={styles.submitButton}
        />
      </View>
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
    gap: spacing.sm,
  },
  previewRow: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  previewDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
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
  nameInput: {
    marginTop: spacing.sm,
    padding: 0,
    fontSize: 16,
    color: '#1C1B1F',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 12,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  swatchSelected: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButton: {
    borderRadius: 100,
    marginTop: spacing.xs,
  },
});
