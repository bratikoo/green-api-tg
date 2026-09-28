import type { Chat } from "@/shared/api/green-api";

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
            className={`w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted ${
              chat.chatId === activeChatId ? "bg-muted" : ""
            }`}
          >
            <div className="text-sm font-medium">{chat.name}</div>
            {chat.username && (
              <div className="text-xs text-muted-foreground">
                {chat.username}
              </div>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
