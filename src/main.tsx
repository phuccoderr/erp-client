import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@components/providers";
import { RouterProvider } from "react-router-dom";
import router from "@router";
import { queryClient } from "@utils";
import { LazyMotion, domAnimation } from "motion/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <LazyMotion features={domAnimation}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </LazyMotion>
    </QueryClientProvider>
  </StrictMode>
);
