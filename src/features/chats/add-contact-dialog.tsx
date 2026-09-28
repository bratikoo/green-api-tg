import { useState } from "react";
import { UserRoundPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/kit/dialog";
import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { useAddContact } from "@/shared/api/hooks/use-add-contact";
import { checkAccount } from "@/shared/api/green-api";
import { useSession } from "@/shared/model/session";
import type { Chat } from "@/shared/api/green-api";

type AddContactDialogProps = {
  onContactAdded: (chat: Chat) => void;
};

const PHONE_REGEX =
  /^[+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

function toChatId(value: string): string {
  return `${value}@c.us`;
}

export function AddContactDialog({ onContactAdded }: AddContactDialogProps) {
  const session = useSession((state) => state.session);
  const addContactMutation = useAddContact();
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const phoneValid = PHONE_REGEX.test(chatId.trim());
  const phoneError =
    chatId.trim().length > 0 && !phoneValid
      ? "Введите корректный номер телефона"
      : null;
  const valid = phoneValid && firstName.trim().length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;
    setChatId("");
    setFirstName("");
    setLastName("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    let resolved = toChatId(chatId);

    try {
      if (session) {
        try {
          const result = await checkAccount(session, Number(chatId));
          if (result?.chatId) {
            resolved = result.chatId;
          }
        } catch {
          setError("Номер недоступен");
          return;
        }
      }

      await addContactMutation.mutateAsync({
        chatId: resolved,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
      });

      const name = lastName.trim()
        ? `${firstName.trim()} ${lastName.trim()}`
        : firstName.trim();

      setOpen(false);
      onContactAdded({
        chatId: resolved,
        name,
        type: "contact",
      });
    } catch {
      setError("Ошибка добавления контакта");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Добавить контакт" />
        }
      >
        <UserRoundPlus />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <label
              className="text-sm font-medium"
              htmlFor="add-contact-chat-id"
            >
              Номер телефона
            </label>
            <Input
              id="add-contact-chat-id"
              placeholder="+7(999) 123-45-67"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
              type="tel"
              aria-invalid={!!phoneError}
            />
          </div>
          {phoneError && (
            <p className="text-xs text-destructive">{phoneError}</p>
          )}
          <div className="grid gap-1.5">
            <label
              className="text-sm font-medium"
              htmlFor="add-contact-first-name"
            >
              Имя
            </label>
            <Input
              id="add-contact-first-name"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <label
              className="text-sm font-medium"
              htmlFor="add-contact-last-name"
            >
              Фамилия (необязательно)
            </label>
            <Input
              id="add-contact-last-name"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Отмена
            </DialogClose>
            <Button
              type="submit"
              disabled={!valid || addContactMutation.isPending}
            >
              {addContactMutation.isPending ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
