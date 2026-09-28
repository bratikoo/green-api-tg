import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { redirect } from "react-router";

export async function protectedLoader() {
  const { refreshToken } = useSession.getState();

  if (!refreshToken) {
    return redirect(ROUTES.LOGIN);
  }

  return null;
}
