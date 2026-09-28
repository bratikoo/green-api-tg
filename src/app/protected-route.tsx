import { useEffect } from "react";
import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { useInstanceState } from "@/shared/api/hooks/use-instance-state";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
  const { session, signOut } = useSession();
  const instanceStateQuery = useInstanceState();

  const stateInstance = session ? instanceStateQuery.data : null;

  useEffect(() => {
    if (session && stateInstance === "notAuthorized") {
      signOut();
    }
  }, [session, stateInstance, signOut]);

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (stateInstance === "notAuthorized") {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
};
