import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/kit/avatar";
import { useAvatar } from "@/shared/api/hooks/use-avatar";

type ChatAvatarProps = {
  chatId: string;
  name: string;
  size?: "default" | "sm" | "lg";
};

export function ChatAvatar({ chatId, name, size }: ChatAvatarProps) {
  const { data } = useAvatar(chatId);
  const url = data?.urlAvatar ?? null;

  return (
    <Avatar size={size}>
      {url && <AvatarImage src={url} alt={name} />}
      <AvatarFallback>
        {name.trim().charAt(0).toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
