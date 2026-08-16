import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCategory } from '@/domain/todo/api/categoryApi';
import { todoCategoryQueryKeys } from '@/domain/todo/hooks/useTodoCategoriesQuery';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoCategoryQueryKeys.list() });
      // 삭제된 카테고리를 참조하던 할 일들의 categoryId가 null로 바뀌므로 목록도 갱신
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
