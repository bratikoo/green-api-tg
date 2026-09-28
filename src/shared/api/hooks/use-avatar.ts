import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { getAvatar } from "@/shared/api/green-api";

export const AVATAR_QUERY_KEY = "avatar";

export function useAvatar(chatId: string | null) {
  const session = useSession((state) => state.session);

  return useQuery({
    queryKey: [AVATAR_QUERY_KEY, session?.idInstance, chatId],
    queryFn: () => getAvatar(session!, chatId!),
    enabled: session !== null && chatId !== null,
    retry: false,
    staleTime: Infinity,
  });
}
