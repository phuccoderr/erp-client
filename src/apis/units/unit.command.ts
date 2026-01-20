import { TANSTACK_KEY_CONST } from "@constants";
import { useMutation } from "@tanstack/react-query";
import type { CreateUnit, UpdateUnit } from "@types";
import { UnitApi } from "./unit.api";

const useCommandCreateUnit = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_UNIT],
    mutationFn: (body: CreateUnit) => {
      return UnitApi.create(body);
    },
  });
};

const useCommandUpdateUnit = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_UNIT],
    mutationFn: ({ id, body }: { id: number; body: UpdateUnit }) => {
      return UnitApi.update(id, body);
    },
  });
};

const useCommandDeleteUnit = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.COMMAND_UNIT],
    mutationFn: (id: number) => {
      return UnitApi.deleteOne(id);
    },
  });
};

export { useCommandCreateUnit, useCommandUpdateUnit, useCommandDeleteUnit };
