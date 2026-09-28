import { useState, type FormEvent } from "react";

import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { LoaderCircle, SendHorizontal } from "lucide-react";

type MessageInputProps = {
  chatName: string;
  disabled: boolean;
  onSend: (message: string) => Promise<void>;
};

export function MessageInput({ disabled, onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      await onSend(text);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 border-t border-border p-3"
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || sending || !message.trim()}>
        {sending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <SendHorizontal />
        )}
      </Button>
    </form>
  );
}
