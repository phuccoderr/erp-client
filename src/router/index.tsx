import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./auth.router";
import { systemRouter } from "./system.router";
import { ProtectedRouter } from "@components/providers";

const router = createBrowserRouter([
  ...authRouter,
  {
    element: <ProtectedRouter />,
    children: [...systemRouter],
  },
]);

export default router;
