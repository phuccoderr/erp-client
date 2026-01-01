import { cn } from "@lib";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = ({
  className,
  children,
  ...props
}: ContainerProps) => {
  return (
    <div className={cn("w-full min-h-screen", className)} {...props}>
      {children}
    </div>
  );
};
