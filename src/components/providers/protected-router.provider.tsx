import { useQueryUserGetMe } from "@apis/users";
import { COOKIE_CONST, ROUTE_CONST } from "@constants";
import { CookieStorageUtil } from "@utils";
import { useEffect, type PropsWithChildren } from "react";

export const ProtectedRouter = ({ children }: PropsWithChildren) => {
  const { isError } = useQueryUserGetMe();
  useEffect(() => {
    if (isError) {
      CookieStorageUtil.delete(COOKIE_CONST.SESSION);
      window.location.href = ROUTE_CONST.LOGIN;
    }
  }, [isError]);
  return children;
};
