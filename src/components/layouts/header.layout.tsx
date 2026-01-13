import { Menu, MoonStar, Sun, User } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { CookieStorageUtil, queryClient } from "@utils";
import { COOKIE_CONST, LANG_KEY_CONST, ROUTE_CONST } from "@constants";
import { toast } from "sonner";
import { useLang } from "@hooks/use-lang";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleLogout = () => {
    CookieStorageUtil.delete(COOKIE_CONST.SESSION);
    queryClient.clear();
    toast.success(t(LANG_KEY_CONST.COMMON_LOGOUT));
    navigate(ROUTE_CONST.LOGIN);
  };

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
            <DropdownMenuItem onClick={handleLogout}>
              {t(LANG_KEY_CONST.COMMON_LOGOUT)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
