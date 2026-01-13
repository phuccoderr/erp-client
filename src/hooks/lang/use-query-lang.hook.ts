import { TANSTACK_KEY_CONST } from "@constants";
import { useQuery } from "@tanstack/react-query";
import type { FindAllLang, Lang, ResponseFindAll } from "@types";
import { LangApi } from "@apis";

const useQueryLangs = (query: FindAllLang) => {
  return useQuery<ResponseFindAll<Lang>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_LANG, query],
    queryFn: async () => {
      return (await LangApi.findAll(query)).data;
    },
  });
};

const useQueryLang = (id: number) => {
  return useQuery<Lang>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_LANG],
    queryFn: async () => {
      return (await LangApi.findOne(id)).data;
    },
    enabled: !!id && id > 0,
  });
};

export { useQueryLangs, useQueryLang };
