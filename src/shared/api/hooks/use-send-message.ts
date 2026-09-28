import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { sendMessage, type ChatMessage } from "@/shared/api/green-api";
import { MESSAGES_QUERY_KEY } from "./use-chat-history";

export function useSendMessage(chatId: string | null) {
  const session = useSession((state) => state.session);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!session || !chatId) throw new Error("Нет активного чата");
      return sendMessage(session, chatId, message);
    },
    onSuccess: (_data, message) => {
      if (!chatId) return;

      const sent: ChatMessage = {
        type: "outgoing",
        idMessage: _data.idMessage,
        timestamp: Math.floor(Date.now() / 1000),
        textMessage: message,
      };

      queryClient.setQueryData<ChatMessage[]>(
        [MESSAGES_QUERY_KEY, session?.idInstance, chatId],
        (prev) => [sent, ...(prev ?? [])],
      );
    },
  });
}
