import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme";
import { cn } from "@/lib/utils";

export function ThemeTabs() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex rounded-lg bg-muted p-1 w-full">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        Light
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        Dark
      </button>
    </div>
  );
}
