import { RoleApi } from "@apis";
import { TANSTACK_KEY_CONST } from "@constants";
import { useMutation } from "@tanstack/react-query";
import type { CreateRole, ResponseERP, UpdateRole } from "@types";
import { queryClient } from "@utils";

const useCommandCreateRole = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_ROLE],
    mutationFn: (body: CreateRole) => {
      return RoleApi.create(body);
    },
    onSuccess: (data: ResponseERP<number>) => {
      if (data.data) {
        queryClient.invalidateQueries({
          queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE],
        });
      }
    },
  });
};

const useCommandUpdateRole = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_ROLE],
    mutationFn: ({ id, body }: { id: number; body: UpdateRole }) => {
      return RoleApi.update(id, body);
    },
  });
};

const useCommandDeleteRole = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_ROLE],
    mutationFn: (id: number) => {
      return RoleApi.deleteOne(id);
    },
  });
};

export { useCommandCreateRole, useCommandUpdateRole, useCommandDeleteRole };
