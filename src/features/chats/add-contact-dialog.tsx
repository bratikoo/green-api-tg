import { useState } from "react";
import { UserRoundPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/kit/dialog";
import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { useAddContact } from "@/shared/api/hooks/use-add-contact";
import type { Chat } from "@/shared/api/green-api";

type AddContactDialogProps = {
  onContactAdded: (chat: Chat) => void;
};

function toChatId(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes("@")) return trimmed;
  return `${trimmed.replace(/\D/g, "")}@c.us`;
}

export function AddContactDialog({ onContactAdded }: AddContactDialogProps) {
  const addContactMutation = useAddContact();
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const valid = chatId.trim().length >= 7;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;
    setChatId("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const resolvedChatId = toChatId(chatId);

    try {
      await addContactMutation.mutateAsync({ chatId: resolvedChatId });

      setOpen(false);
      onContactAdded({
        chatId: resolvedChatId,
        name: resolvedChatId,
        type: "contact",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось добавить контакт");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Добавить контакт" />}>
        <UserRoundPlus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить контакт</DialogTitle>
          <DialogDescription>
            Укажите ID чата (например, 79991234567@c.us). После добавления откроется чат с ним.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="add-contact-chat-id">
              ID чата
            </label>
            <Input
              id="add-contact-chat-id"
              placeholder="79991234567@c.us"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Отмена</DialogClose>
            <Button type="submit" disabled={!valid || addContactMutation.isPending}>
              {addContactMutation.isPending ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
