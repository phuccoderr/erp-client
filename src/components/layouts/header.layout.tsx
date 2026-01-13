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
import { useLangStore, useThemeStore } from "@stores";
import { useNavigate } from "react-router-dom";
import { CookieStorageUtil, queryClient } from "@utils";
import { COOKIE_CONST, LANG_KEY_CONST, ROUTE_CONST } from "@constants";
import { toast } from "sonner";
import { useLang } from "@hooks/use-lang";
import { VN, US } from "country-flag-icons/react/3x2";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useLang();
  const { lang, setLang } = useLangStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    CookieStorageUtil.delete(COOKIE_CONST.SESSION);
    queryClient.clear();
    toast.success(t(LANG_KEY_CONST.COMMON_LOGOUT));
    navigate(ROUTE_CONST.LOGIN);
  };

  const handleChangeLang = (lang: "vi" | "en") => {
    setLang(lang);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              {lang === "vi" ? (
                <VN className="size-5 rounded-sm" />
              ) : (
                <US className="size-5 rounded-sm" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleChangeLang("vi")}>
              <VN className="rounded-sm size-5" />
              Vietnamese
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChangeLang("en")}>
              <US className="rounded-sm size-5" />
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
