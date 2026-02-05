import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Image,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  Typography,
  useSidebar,
} from "@components/ui";
import logo from "@assets/images/logo.png";
import icon from "@assets/images/icon.png";
import {
  ChevronRight,
  CircleUser,
  Home,
  KeyRound,
  Scale,
  ShieldUser,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLang } from "@hooks/use-lang";
import { LANG_KEY_CONST, ROUTE_CONST } from "@constants";

type Item = {
  title: string;
  url?: string;
  icon?: ReactNode;
  tooltip?: string;
  children?: Item[];
};

type GroupItem = {
  name: string;
  items: Item[];
};

const groupSidebar: GroupItem[] = [
  {
    name: LANG_KEY_CONST.MENU_DASHBOARD,
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: <Home />,
      },
    ],
  },
  {
    name: LANG_KEY_CONST.MENU_RBAC,
    items: [
      {
        title: LANG_KEY_CONST.MENU_RBAC_USER,
        url: "#",
        icon: <CircleUser />,
      },

      {
        title: LANG_KEY_CONST.MENU_RBAC_ROLE,
        url: ROUTE_CONST.RBAC.ROLE,
        icon: <ShieldUser />,
      },
      {
        title: LANG_KEY_CONST.MENU_RBAC_PERMISSION,
        url: ROUTE_CONST.RBAC.PERMISSON,
        icon: <KeyRound />,
      },
    ],
  },
  {
    name: LANG_KEY_CONST.MENU_INVENTORY_MANAGEMENT,
    items: [
      {
        title: LANG_KEY_CONST.MENU_INVENTORY_MANAGEMENT_UNIT,
        url: ROUTE_CONST.INVENTORY_MANAGEMENT.UNIT,
        icon: <Scale />,
      },
      {
        title: LANG_KEY_CONST.MENU_INVENTORY_MANAGEMENT_CATEGORY,
        url: ROUTE_CONST.INVENTORY_MANAGEMENT.CATEGORY,
        icon: <Scale />,
      },
    ],
  },
  {
    name: LANG_KEY_CONST.MENU_SETTING,
    items: [],
  },
];

const Tree = ({ item }: { item: Item }) => {
  const path = useLocation();
  const { t } = useLang();

  if (!item.children?.length && item.url) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={"wtf"}
          isActive={item.url === path.pathname}
          asChild
        >
          <NavLink to={item.url}>
            {item.icon}
            <Typography>{t(item.title)}</Typography>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible className="group/collapsible" defaultOpen={false}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {item.icon}
            <Typography>{item.title}</Typography>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <Tree key={child.title} item={child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export const AppSidebar = () => {
  const { open, state } = useSidebar();
  const { t } = useLang();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row">
        <Image
          className={`h-12 ${
            open ? "w-46 opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          src={logo}
          alt="logo"
        />
        <Image
          className={`h-12 ${
            open ? "w-0 opacity-0 scale-95" : "w-8 opacity-100 scale-100"
          }`}
          src={icon}
          alt="icon"
        />
      </SidebarHeader>
      <SidebarContent>
        {groupSidebar.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>
              {isCollapsed ? "..." : t(group.name)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <Tree key={item.title} item={item}></Tree>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
