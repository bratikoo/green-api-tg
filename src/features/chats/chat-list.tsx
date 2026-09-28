import type { Chat } from "@/shared/api/green-api";
import { ChatAvatar } from "@/features/chats/chat-avatar";

type ChatListProps = {
  chats: Chat[] | null;
  activeChatId: string | null;
  error: string | null;
  onSelect: (chat: Chat) => void;
};

export function ChatList({
  chats,
  activeChatId,
  error,
  onSelect,
}: ChatListProps) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!chats) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Загрузка чатов...
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Нет чатов
      </div>
    );
  }

  return (
    <ul className="flex flex-col overflow-y-auto">
      {chats.map((chat) => (
        <li key={chat.chatId}>
          <button
            type="button"
            onClick={() => onSelect(chat)}
            className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted ${
              chat.chatId === activeChatId ? "bg-muted" : ""
            }`}
          >
            <ChatAvatar
              chatId={chat.chatId}
              name={chat.name}
              size="lg"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{chat.name}</div>
              {chat.username && (
                <div className="truncate text-xs text-muted-foreground">
                  {chat.username}
                </div>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
