import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTodo } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoId: number) => deleteTodo(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
