import { ROUTE_CONST } from "@constants";
import LoginPage from "@pages/login";
import type { RouteObject } from "react-router-dom";

export const authRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.LOGIN,
    element: <LoginPage />,
  },
];
