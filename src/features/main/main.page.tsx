import { useMemo, useState } from "react";

import { useSession } from "@/shared/model/session";
import { useChats } from "@/shared/api/hooks/use-chats";
import { useChatHistory } from "@/shared/api/hooks/use-chat-history";
import { useSendMessage } from "@/shared/api/hooks/use-send-message";
import type { Chat } from "@/shared/api/green-api";
import { ChatList } from "@/features/chats/chat-list";
import { MessagesList } from "@/features/chats/messages-list";
import { MessageInput } from "@/features/chats/message-input";

function MainPage() {
  const session = useSession((state) => state.session);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const chatsQuery = useChats();
  const messagesQuery = useChatHistory(activeChat?.chatId ?? null);
  const sendMessageMutation = useSendMessage(activeChat?.chatId ?? null);

  const chats = chatsQuery.data ?? null;

  const handleSend = async (text: string) => {
    await sendMessageMutation.mutateAsync(text);
  };

  const activeChatName = useMemo(() => activeChat?.name ?? "", [activeChat]);

  return (
    <div className="flex h-dvh">
      <aside className="flex w-72 shrink-0 flex-col border-r border-border">
        <header className="border-b border-border px-4 py-3 text-sm font-medium">
          Чаты
        </header>
        <div className="flex-1 overflow-y-auto">
          <ChatList
            chats={chats}
            activeChatId={activeChat?.chatId ?? null}
            error={chatsQuery.error?.message ?? null}
            onSelect={setActiveChat}
          />
        </div>
      </aside>
      <main className="flex flex-1 flex-col">
        {activeChat ? (
          <>
            <header className="border-b border-border px-4 py-3 text-sm font-medium">
              {activeChatName}
            </header>
            <MessagesList
              messages={messagesQuery.data ?? null}
              error={
                // при отправке наблюдается refetch, не показываем ошибку как блокирующую
                messagesQuery.error?.message ?? null
              }
            />
            <MessageInput
              chatName={activeChatName}
              disabled={!session}
              onSend={handleSend}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Выберите чат
          </div>
        )}
      </main>
    </div>
  );
}

export const Component = MainPage;
