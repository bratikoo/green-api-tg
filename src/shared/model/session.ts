import { create } from "zustand";

import { CONFIG } from "./config";

export const API_URL = CONFIG.API_URL;

export type Session = {
  idInstance: string;
  apiTokenInstance: string;
};

type SessionState = {
  refreshToken: string | null;
  session: Session | null;
  signIn: (idInstance: string, apiTokenInstance: string) => void;
  signOut: () => void;
};

const STORAGE_KEY = "green-api-tg-session";

function getInitialSession(): Pick<SessionState, "session" | "refreshToken"> {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { session: null, refreshToken: null };
  }

  try {
    const session = JSON.parse(stored) as Session;

    if (!session.idInstance || !session.apiTokenInstance) {
      return { session: null, refreshToken: null };
    }

    return { session, refreshToken: session.apiTokenInstance };
  } catch {
    return { session: null, refreshToken: null };
  }
}

export const useSession = create<SessionState>()((set, get) => ({
  ...getInitialSession(),
  signIn: (idInstance, apiTokenInstance) => {
    const current = get().session;
    if (
      current &&
      current.idInstance === idInstance &&
      current.apiTokenInstance === apiTokenInstance
    ) {
      return;
    }

    const session = { idInstance, apiTokenInstance };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    set({ session, refreshToken: apiTokenInstance });
  },
  signOut: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ session: null, refreshToken: null });
  },
}));

export async function getStateInstance({
  idInstance,
  apiTokenInstance,
}: Session): Promise<string> {
  const res = await fetch(
    `${API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
  );

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Неверные idInstance или apiTokenInstance"
        : `Ошибка GREEN API: ${res.status}`,
    );
  }

  const data = (await res.json()) as { stateInstance?: string };

  return data.stateInstance ?? "notAuthorized";
}

export async function getQr({
  idInstance,
  apiTokenInstance,
}: Session): Promise<string | null> {
  const res = await fetch(
    `${API_URL}/waInstance${idInstance}/qr/${apiTokenInstance}`,
  );

  if (!res.ok) {
    throw new Error(`Ошибка получения QR-кода: ${res.status}`);
  }

  const data = (await res.json()) as { type?: string; message?: string };

  if (data.type === "qrCode" && data.message) {
    return `data:image/png;base64,${data.message}`;
  }

  return null;
}
