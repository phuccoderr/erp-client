import { PermissionApi } from "./permisson.api";
import { TANSTACK_KEY_CONST } from "@constants";
import { useQuery } from "@tanstack/react-query";
import type { ResponseFindAll, FindAllPermission, Permission } from "@types";

const useQueryPermissions = (query: FindAllPermission) => {
  return useQuery<ResponseFindAll<Permission>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_PERMISSION, query],
    queryFn: async () => {
      return (await PermissionApi.findAll(query)).data;
    },
  });
};

const useQueryPermission = (id: number) => {
  return useQuery<Permission>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_PERMISSION],
    queryFn: async () => {
      return (await PermissionApi.findOne(id)).data;
    },
    enabled: !!id && id > 0,
  });
};

export { useQueryPermissions, useQueryPermission };
