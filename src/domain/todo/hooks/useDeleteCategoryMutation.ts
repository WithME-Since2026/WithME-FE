import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCategory } from '@/domain/todo/api/categoryApi';
import { todoCategoryQueryKeys } from '@/domain/todo/hooks/useTodoCategoriesQuery';

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoCategoryQueryKeys.list() });
    },
  });
}
