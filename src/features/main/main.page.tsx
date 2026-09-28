import { useMemo, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";

import { useSession } from "@/shared/model/session";
import { useChats } from "@/shared/api/hooks/use-chats";
import { useChatHistory } from "@/shared/api/hooks/use-chat-history";
import { useSendMessage } from "@/shared/api/hooks/use-send-message";
import type { Chat } from "@/shared/api/green-api";
import { ChatList } from "@/features/chats/chat-list";
import { MessagesList } from "@/features/chats/messages-list";
import { MessageInput } from "@/features/chats/message-input";
import { Button } from "@/shared/ui/kit/button";
import { useLogout } from "@/shared/api/hooks/use-logout";
import { ThemeToggle } from "@/shared/ui/kit/theme-toggle";
import { AddContactDialog } from "@/features/chats/add-contact-dialog";

function MainPage() {
  const session = useSession((state) => state.session);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatsQuery = useChats();
  const messagesQuery = useChatHistory(activeChat?.chatId ?? null);
  const sendMessageMutation = useSendMessage(activeChat?.chatId ?? null);
  const logoutMutation = useLogout();

  const chats = chatsQuery.data ?? null;

  const handleSend = async (text: string) => {
    await sendMessageMutation.mutateAsync(text);
  };

  const handleContactAdded = (chat: Chat) => {
    setActiveChat(chat);
  };

  const activeChatName = useMemo(() => activeChat?.name ?? "", [activeChat]);

  return (
    <div className="flex h-dvh">
      <aside
        className={`flex shrink-0 flex-col overflow-hidden border-r border-border transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72" : "w-0 border-r-0"
        }`}
        data-collapsed={!sidebarOpen}
      >
        <header className="flex h-12 w-72 shrink-0 items-center justify-between border-b border-border px-3 text-sm font-medium">
          Чаты
          <div className="flex items-center gap-1">
            <AddContactDialog onContactAdded={handleContactAdded} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Скрыть список чатов"
              onClick={() => setSidebarOpen(false)}
            >
              <PanelLeftClose />
            </Button>
          </div>
        </header>
        <div className="w-72 flex-1 overflow-y-auto">
          <ChatList
            chats={chats}
            activeChatId={activeChat?.chatId ?? null}
            error={chatsQuery.error?.message ?? null}
            onSelect={setActiveChat}
          />
        </div>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3 text-sm font-medium">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Показать список чатов"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeftOpen />
            </Button>
          )}
          {activeChatName || "Выберите чат"}
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Выйти из аккаунта"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut />
            </Button>
          </div>
        </header>
        {activeChat ? (
          <>
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
            Чтобы начать общение, выберите чат слева
          </div>
        )}
      </main>
    </div>
  );
}

export const Component = MainPage;
