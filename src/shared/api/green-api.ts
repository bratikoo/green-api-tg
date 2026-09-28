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

export async function getChats(session: Session): Promise<Chat[]> {
  return fetch(getChatUrl(session, "getChats")).then((res) =>
    toJson<Chat[]>(res),
  );
}

export type AvatarResponse = {
  urlAvatar?: string | null;
};

export async function getAvatar(
  session: Session,
  chatId: string,
): Promise<AvatarResponse> {
  return fetch(getChatUrl(session, "getAvatar"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId }),
  }).then((res) => toJson<AvatarResponse>(res));
}

export async function getChatHistory(
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

export async function logout(
  session: Session,
): Promise<{ stateInstance: string }> {
  return fetch(getChatUrl(session, "logout"), {
    method: "GET",
  }).then((res) => toJson<{ stateInstance: string }>(res));
}

export type AddContactInput = {
  chatId: string;
};

export async function addContact(
  session: Session,
  { chatId }: AddContactInput,
): Promise<{ success: boolean }> {
  return fetch(getChatUrl(session, "addContact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId }),
  }).then((res) => toJson<{ success: boolean }>(res));
}

export async function sendMessage(
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
