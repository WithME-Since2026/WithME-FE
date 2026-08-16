import { useMutation, useQueryClient } from '@tanstack/react-query';

import { completeTodo } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';
import type { CompleteTodoRequest } from '@/domain/todo/types';

export function useCompleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CompleteTodoRequest) => completeTodo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
