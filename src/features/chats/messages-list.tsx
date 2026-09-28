import type { ChatMessage } from "@/shared/api/green-api";

type MessagesListProps = {
  messages: ChatMessage[] | null;
  error: string | null;
};

export function MessagesList({ messages, error }: MessagesListProps) {
  if (error) {
    return (
      <div className="bg-background bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:16px_16px] flex flex-1 items-center justify-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="bg-background bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:16px_16px] flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Загрузка сообщений...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-background bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:16px_16px] flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Нет сообщений
      </div>
    );
  }

  return (
    <div className="bg-background bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] [background-size:16px_16px] flex flex-1 flex-col-reverse gap-1.5 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.idMessage}
          className={`max-w-[75%] rounded-lg px-3 py-1.5 text-sm ${
            message.type === "outgoing"
              ? "self-end bg-primary text-primary-foreground"
              : "self-start bg-muted"
          }`}
        >
          <div className="wrap-break-word whitespace-pre-wrap">
            {message.textMessage ?? "—"}
          </div>
          <div className="text-[10px] opacity-60">
            {new Date(message.timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
