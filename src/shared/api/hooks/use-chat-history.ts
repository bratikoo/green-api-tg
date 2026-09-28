import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { getChatHistory } from "@/shared/api/green-api";

export const MESSAGES_QUERY_KEY = "messages";
export const MESSAGES_REFETCH_INTERVAL_MS = 7000;

export function useChatHistory(chatId: string | null) {
  const session = useSession((state) => state.session);

  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, session?.idInstance, chatId],
    queryFn: () => getChatHistory(session!, chatId!),
    enabled: session !== null && chatId !== null,
    refetchInterval: MESSAGES_REFETCH_INTERVAL_MS,
  });
}
