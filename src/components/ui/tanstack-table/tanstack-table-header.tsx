import { type ReactNode } from "react";
import { Typography } from "@components/ui";

interface HeaderProps {
  children: ReactNode;
  title?: string;
}
const TanstackTableHeader = ({ children, title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center py-2">
      <Typography variant="h4" className="flex-1">
        {title}
      </Typography>
      <div className="flex items-end">{children}</div>
    </div>
  );
};

export { TanstackTableHeader };
