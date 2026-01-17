import { ROUTE_CONST } from "@constants";
import PermissionPage from "@pages/rbac/permisson";
import RolePage from "@pages/rbac/role";
import type { RouteObject } from "react-router-dom";

export const rbacRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.RBAC.PERMISSON,
    element: <PermissionPage />,
  },
  {
    path: ROUTE_CONST.RBAC.ROLE,
    element: <RolePage />,
  },
];
