import { API_URL, type Session } from "@/shared/model/session";

export type Chat = {
  chatId: string;
  name: string;
  type: string;
  phoneNumber?: number;
  username?: string;
};

export type ChatMessage = {
  type: "outgoing" | "incoming";
  idMessage: string;
  timestamp: number;
  textMessage?: string;
  senderName?: string;
};

export function getChatUrl(
  { idInstance, apiTokenInstance }: Session,
  method: string,
) {
  return `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

async function toJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Ошибка GREEN API: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export function getChats(session: Session): Promise<Chat[]> {
  return fetch(getChatUrl(session, "getChats")).then((res) =>
    toJson<Chat[]>(res),
  );
}

export function getChatHistory(
  session: Session,
  chatId: string,
  count = 50,
): Promise<ChatMessage[]> {
  return fetch(getChatUrl(session, "getChatHistory"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, count }),
  }).then((res) => toJson<ChatMessage[]>(res));
}

export function sendMessage(
  session: Session,
  chatId: string,
  message: string,
): Promise<{ idMessage: string }> {
  return fetch(getChatUrl(session, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  }).then((res) => toJson<{ idMessage: string }>(res));
}
