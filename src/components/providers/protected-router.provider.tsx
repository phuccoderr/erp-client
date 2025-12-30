import { UserApi } from "@apis";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const ProtectedRouter = async () => {
  const me = await UserApi.getMe();
  const navigate = useNavigate();
  useEffect(() => {
    if (!me) {
      navigate("/login");
    }
  }, [me]);
  return <Outlet />;
};
