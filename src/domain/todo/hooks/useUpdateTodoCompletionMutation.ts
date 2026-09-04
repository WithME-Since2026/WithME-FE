import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTodoCompletion } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';
import type { UpdateTodoCompletionRequest } from '@/domain/todo/types';

export function useUpdateTodoCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTodoCompletionRequest) => updateTodoCompletion(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
