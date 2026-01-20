import { TANSTACK_KEY_CONST } from "@constants";
import { useQuery } from "@tanstack/react-query";
import type { FindAllRole, ResponseFindAll, Role } from "@types";
import { RoleApi } from "./role.api";

const useQueryRoles = (query: FindAllRole) => {
  return useQuery<ResponseFindAll<Role>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE, query],
    queryFn: async () => {
      return (await RoleApi.findAll(query)).data;
    },
  });
};

const useQueryRole = (id: number) => {
  return useQuery<Role>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE, id],
    queryFn: async () => {
      return (await RoleApi.findOne(id)).data;
    },
    enabled: !!id,
  });
};

export { useQueryRoles, useQueryRole };
