import { UserApi } from "@apis";
import { useQuery } from "@tanstack/react-query";
import type { ResponseERP } from "@types";
import { COOKIE_CONST, TANSTACK_KEY_CONST } from "@constants";
import { CookieStorageUtil } from "@utils";

const useQueryUserGetMe = () => {
  return useQuery<ResponseERP<any>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_USER],
    queryFn: async () => {
      return (await UserApi.getMe()).data;
    },
    enabled: !CookieStorageUtil.get(COOKIE_CONST.SESSION),
  });
};

export { useQueryUserGetMe };
