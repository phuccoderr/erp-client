import { UserApi } from "@apis";
import { useQuery } from "@tanstack/react-query";
import type { ResponseERP } from "@types";
import { TANSTACK_KEY_CONST } from "@constants";

const useQueryUserGetMe = () => {
  return useQuery<ResponseERP<any>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_USER],
    queryFn: async () => {
      return (await UserApi.getMe()).data;
    },
  });
};

export { useQueryUserGetMe };
