import { cn } from "@lib";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = ({
  className,
  children,
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
};
