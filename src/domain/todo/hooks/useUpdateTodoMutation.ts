import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTodo } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';
import type { UpdateTodoRequest } from '@/domain/todo/types';

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTodoRequest) => updateTodo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
