import { ROUTE_CONST } from "@constants";
import { useQueryUserGetMe } from "@hooks/user";
import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRouter = ({ children }: PropsWithChildren) => {
  const { isError } = useQueryUserGetMe();
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      navigate(ROUTE_CONST.LOGIN);
    }
  }, [isError]);
  return children;
};
