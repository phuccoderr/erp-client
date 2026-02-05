import { TANSTACK_KEY_CONST } from "@constants";
import { useQuery } from "@tanstack/react-query";
import type { Category, FindAllCategory, ResponseFindAll } from "@types";
import { CategoryApi } from "./category.api";

const useQueryCategories = (query: FindAllCategory) => {
  return useQuery<ResponseFindAll<Category>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_CATEGORY, query],
    queryFn: async () => {
      return (await CategoryApi.findAll(query)).data;
    },
  });
};

const useQueryCategory = (id: number) => {
  return useQuery<Category>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_CATEGORY, id],
    queryFn: async () => {
      return (await CategoryApi.findOne(id)).data;
    },
    enabled: !!id,
  });
};

export { useQueryCategories, useQueryCategory };
