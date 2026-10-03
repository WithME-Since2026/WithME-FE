import { useQuery } from '@tanstack/react-query';

import { getTodoList } from '@/domain/todo/api/todoApi';

export const todoQueryKeys = {
  all: ['todo'] as const,
  list: () => [...todoQueryKeys.all, 'list'] as const,
};

export function useTodoListQuery() {
  return useQuery({
    queryKey: todoQueryKeys.list(),
    queryFn: getTodoList,
  });
}
