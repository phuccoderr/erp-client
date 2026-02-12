import { TANSTACK_KEY_CONST } from "@constants";
import { useMutation } from "@tanstack/react-query";
import type { CreateCategory, UpdateCategory } from "@types";
import { CategoryApi } from "./category.api";

const useCommandCreateCategory = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_CATEGORY],
    mutationFn: async (body: CreateCategory) => {
      return (await CategoryApi.create(body)).data;
    },
  });
};

const useCommandUpdateCategory = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_CATEGORY],
    mutationFn: ({ id, body }: { id: number; body: UpdateCategory }) => {
      return CategoryApi.update(id, body);
    },
  });
};

const useCommandDeleteCategory = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_CATEGORY],
    mutationFn: (id: number) => {
      return CategoryApi.deleteOne(id);
    },
  });
};

export {
  useCommandCreateCategory,
  useCommandUpdateCategory,
  useCommandDeleteCategory,
};
