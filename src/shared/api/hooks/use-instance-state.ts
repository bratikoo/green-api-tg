import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { useSession, getStateInstance, type Session } from "@/shared/model/session";

export function useInstanceState(
  overrideSession?: Session | null,
): UseQueryResult<string, Error> {
  const session = useSession((state) => state.session);
  const activeSession = overrideSession ?? session;

  return useQuery({
    queryKey: ["stateInstance", activeSession?.idInstance],
    queryFn: () => getStateInstance(activeSession!),
    enabled: activeSession !== null,
    refetchInterval: 3000,
  });
}
