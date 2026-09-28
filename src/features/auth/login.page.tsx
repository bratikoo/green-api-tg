import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { CONFIG } from "@/shared/model/config";
import {
  getQr,
  getStateInstance,
  useSession,
  type Session,
} from "@/shared/model/session";

const STATE_POLL_INTERVAL_MS = 3000;
const QR_POLL_INTERVAL_MS = 5000;

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
  const [credentials] = useState(initialCredentials);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!credentials) return;

    let cancelled = false;

    const checkState = async () => {
      try {
        const state = await getStateInstance(credentials);
        if (cancelled) return;

        if (state === "authorized") {
          setAuthorized(true);
          signIn(credentials.idInstance, credentials.apiTokenInstance);
          navigate(ROUTES.HOME, { replace: true });
        } else {
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось проверить авторизацию",
          );
        }
      }
    };

    const refreshQr = async () => {
      try {
        const image = await getQr(credentials);
        if (cancelled) return;

        if (image) {
          setQr(image);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось получить QR-код",
          );
        }
      }
    };

    void refreshQr();
    const qrInterval = setInterval(refreshQr, QR_POLL_INTERVAL_MS);

    void checkState();
    const stateInterval = setInterval(checkState, STATE_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(qrInterval);
      clearInterval(stateInterval);
    };
  }, [credentials, navigate, signIn]);

  if (authorized) {
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
