import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.router";
import { systemRouter } from "./system.router";
import { ProtectedRouter } from "@components/providers";
import HomePage from "@pages/home";
import LayoutPage from "@pages/layout";
import { ROUTE_CONST } from "@constants";
import { rbacRouter } from "./rbac.router";
import Loading from "@pages/system/loading";

const router = createBrowserRouter(
  [
    // Public
    ...authRouter,
    // Private
    {
      element: (
        <ProtectedRouter>
          <LayoutPage />
        </ProtectedRouter>
      ),
      children: [
        {
          path: ROUTE_CONST.INDEX,
          element: <HomePage />,
        },
        ...systemRouter,
        ...rbacRouter,
      ],
    },
    {
      path: "*",
      element: <Loading />,
    },
  ],
  {}
);

export default router;
