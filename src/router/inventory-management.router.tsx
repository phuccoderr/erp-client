import { ROUTE_CONST } from "@constants";
import CategoriesPage from "@pages/inventory-management/categories";
import UnitsPage from "@pages/inventory-management/units";
import type { RouteObject } from "react-router-dom";

export const inventoryManagementRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.INVENTORY_MANAGEMENT.UNIT,
    element: <UnitsPage />,
  },
  {
    path: ROUTE_CONST.INVENTORY_MANAGEMENT.CATEGORY,
    element: <CategoriesPage />,
  },
];
