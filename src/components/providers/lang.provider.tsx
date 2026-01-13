import { useLang } from "@hooks/use-lang";

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  useLang();
  return <>{children}</>;
};
