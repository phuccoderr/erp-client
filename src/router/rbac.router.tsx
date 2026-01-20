import { ROUTE_CONST } from "@constants";
import PermissionsPage from "@pages/rbac/permissions";
import RolesPage from "@pages/rbac/roles";
import type { RouteObject } from "react-router-dom";

export const rbacRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.RBAC.PERMISSON,
    element: <PermissionsPage />,
  },
  {
    path: ROUTE_CONST.RBAC.ROLE,
    element: <RolesPage />,
  },
];
