import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LangProvider, ThemeProvider } from "@components/providers";
import { RouterProvider } from "react-router-dom";
import router from "@router";
import { queryClient } from "@utils";
import { LazyMotion, domAnimation } from "motion/react";
import { Toaster as ToasterSonner } from "@components/ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <LazyMotion features={domAnimation}>
        <LangProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
            <ToasterSonner
              duration={1.5}
              position="top-right"
              richColors
              expand={false}
            />
          </ThemeProvider>
        </LangProvider>
      </LazyMotion>
    </QueryClientProvider>
  </StrictMode>
);
