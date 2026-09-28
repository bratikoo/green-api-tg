import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { useSession, getQr, type Session } from "@/shared/model/session";

export function useQr(overrideSession?: Session | null): UseQueryResult<string | null, Error> {
  const session = useSession((state) => state.session);
  const activeSession = overrideSession ?? session;

  return useQuery({
    queryKey: ["qr", activeSession?.idInstance],
    queryFn: () => getQr(activeSession!),
    enabled: activeSession !== null,
    refetchInterval: 5000,
  });
}
