import { cn } from "@lib";
import type { ReactNode } from "react";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "muted";
  children: ReactNode;
  className?: string;
}

export const Typography = ({
  variant = "p",
  children,
  className,
}: TypographyProps) => {
  const basedClassName = "font-vietnam text-balance";
  if (variant === "h1") {
    return (
      <h1
        className={cn(
          basedClassName,
          "font-vietnam scroll-m-20 text-center text-4xl tracking-tight ",
          className
        )}
      >
        {children}
      </h1>
    );
  }

  if (variant === "h2") {
    return (
      <h2
        className={cn(
          basedClassName,
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
          className
        )}
      >
        {children}
      </h2>
    );
  }

  if (variant === "h3") {
    return (
      <h3
        className={cn(
          basedClassName,
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
      >
        {children}
      </h3>
    );
  }

  if (variant === "h4") {
    return (
      <h4
        className={cn(
          basedClassName,
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
      >
        {children}
      </h4>
    );
  }

  if (variant === "muted") {
    return (
      <p
        className={cn(
          basedClassName,
          "text-muted-foreground text-sm",
          className
        )}
      >
        {children}
      </p>
    );
  }

  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
};
