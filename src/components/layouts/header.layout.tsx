import { BellDotIcon, Menu, MoonStar, Sun, User } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useSidebar,
} from "@components/ui";
import { useThemeStore } from "@stores";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex justify-between px-4 py-2 items-center">
      <Button
        className="justify-start"
        onClick={toggleSidebar}
        variant="ghost"
        size="icon-sm"
      >
        <Menu />
      </Button>
      <div className="flex gap-2">
        <Button onClick={toggleTheme} size="icon" variant="outline">
          {theme === "light" ? <Sun /> : <MoonStar />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
