import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.router";
import { systemRouter } from "./system.router";
import { ProtectedRouter } from "@components/providers";
import HomePage from "@pages/home";
import LayoutPage from "@pages/layout";
import { ROUTE_CONST } from "@constants";
import { rbacRouter } from "./rbac.router";
import Loading from "@pages/system/loading";
import ErrorLayout from "@pages/layout/components/error-layout.component";
import { inventoryManagementRouter } from "./inventory-management.router";

const router = createBrowserRouter([
  // Public
  ...authRouter,
  // Private
  {
    element: (
      <ProtectedRouter>
        <LayoutPage />
      </ProtectedRouter>
    ),
    errorElement: <ErrorLayout />,
    children: [
      {
        path: ROUTE_CONST.INDEX,
        element: <HomePage />,
      },
      ...systemRouter,
      ...rbacRouter,
      ...inventoryManagementRouter,
    ],
  },
  {
    path: "*",
    element: <Loading />,
  },
]);

export default router;
