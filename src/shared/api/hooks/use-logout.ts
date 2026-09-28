import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/shared/model/session";
import { logout } from "@/shared/api/green-api";

export function useLogout() {
  const session = useSession((state) => state.session);
  const signOut = useSession((state) => state.signOut);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Нет активной сессии");
      return logout(session);
    },
    onSuccess: () => {
      queryClient.clear();
      signOut();
    },
    onError: () => {
      queryClient.clear();
      signOut();
    },
  });
}
