import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { CONFIG } from "@/shared/model/config";
import { useSession, type Session } from "@/shared/model/session";
import { useInstanceState } from "@/shared/api/hooks/use-instance-state";
import { useQr } from "@/shared/api/hooks/use-qr";

const initialCredentials: Session | null =
  CONFIG.ID_INSTANCE && CONFIG.API_TOKEN_INSTANCE
    ? {
        idInstance: String(CONFIG.ID_INSTANCE),
        apiTokenInstance: CONFIG.API_TOKEN_INSTANCE,
      }
    : null;

function LoginPage() {
  const navigate = useNavigate();
  const signIn = useSession((state) => state.signIn);
  const session = useSession((state) => state.session);
  const credentials = session ?? initialCredentials;

  const stateQuery = useInstanceState(credentials);
  const qrQuery = useQr(credentials);

  const state = stateQuery.data;
  const qr = qrQuery.data ?? null;
  const error = stateQuery.error?.message ?? qrQuery.error?.message ?? null;

  useEffect(() => {
    if (!credentials) return;

    if (state === "authorized") {
      signIn(credentials.idInstance, credentials.apiTokenInstance);
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [credentials, state, signIn, navigate]);

  if (state === "authorized") {
    return null;
  }

  if (!credentials) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-destructive">
        Не заданы VITE_ID_INSTANCE / VITE_API_TOKEN_INSTANCE в .env
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-lg font-medium">Вход GREEN API</h1>
      <p className="text-sm text-muted-foreground">
        Отсканируйте QR-код в Telegram
      </p>
      {qr ? (
        <img
          src={qr}
          alt="QR-код авторизации"
          className="size-72 rounded-xl ring-1 ring-foreground/10"
        />
      ) : (
        <div className="flex size-72 items-center justify-center rounded-xl ring-1 ring-foreground/10 text-sm text-muted-foreground">
          Загрузка QR-кода...
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export const Component = LoginPage;
