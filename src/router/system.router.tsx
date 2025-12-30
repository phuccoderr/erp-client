import { ROUTE_CONST } from "@constants";
import Lang from "@pages/lang";
import type { RouteObject } from "react-router-dom";

export const systemRouter: RouteObject[] = [
  {
    path: ROUTE_CONST.SYSTEM.LANG,
    element: <Lang />,
  },
];
