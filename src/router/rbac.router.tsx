import { ROUTE_CONST } from "@constants";
import PermissionPage from "@pages/permisson";
import type { RouteObject } from "react-router-dom";

export const rbacRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.RBAC.PERMISSON,
    element: <PermissionPage />,
  },
];
