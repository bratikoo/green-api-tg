import { MoonStar, Sun } from "lucide-react";

import { Button } from "@/shared/ui/kit/button";
import { useTheme } from "@/shared/model/theme";

function ThemeToggle() {
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggleTheme);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun /> : <MoonStar />}
    </Button>
  );
}

export { ThemeToggle };
