import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { addContact, type AddContactInput } from "@/shared/api/green-api";
import { CHATS_QUERY_KEY } from "./use-chats";

export function useAddContact() {
  const session = useSession((state) => state.session);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddContactInput) => {
      if (!session) throw new Error("Нет активной сессии");
      return addContact(session, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
    },
  });
}
