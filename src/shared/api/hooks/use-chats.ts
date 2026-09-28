import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { getChats } from "@/shared/api/green-api";

export const CHATS_QUERY_KEY = "chats";
export const CHATS_REFETCH_INTERVAL_MS = 7000;

export function useChats() {
  const session = useSession((state) => state.session);

  return useQuery({
    queryKey: [CHATS_QUERY_KEY, session?.idInstance],
    queryFn: () => getChats(session!),
    enabled: session !== null,
    refetchInterval: CHATS_REFETCH_INTERVAL_MS,
  });
}
