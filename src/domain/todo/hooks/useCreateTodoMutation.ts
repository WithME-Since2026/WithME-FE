import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTodo } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';
import type { CreateTodoRequest } from '@/domain/todo/types';

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTodoRequest) => createTodo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
