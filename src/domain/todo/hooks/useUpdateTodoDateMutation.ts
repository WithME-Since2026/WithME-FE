import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTodoDate } from '@/domain/todo/api/todoApi';
import { todoQueryKeys } from '@/domain/todo/hooks/useTodoListQuery';
import type { UpdateTodoDateRequest } from '@/domain/todo/types';

export function useUpdateTodoDateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTodoDateRequest) => updateTodoDate(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.list() });
    },
  });
}
