import { useQuery } from '@tanstack/react-query';

import { searchContacts } from '@/domain/meeting/api/meetingApi';
import { meetingQueryKeys } from '@/domain/meeting/hooks/useHomeMeetingsQuery';

export function useSearchContactsQuery(query: string) {
  return useQuery({
    queryKey: meetingQueryKeys.contacts(query),
    queryFn: () => searchContacts(query),
  });
}
