import { TANSTACK_KEY_CONST } from "@constants";
import { useQuery } from "@tanstack/react-query";
import type { FindAllUnit, ResponseFindAll, Unit } from "@types";
import { UnitApi } from "./unit.api";

const useQueryUnits = (query: FindAllUnit) => {
  return useQuery<ResponseFindAll<Unit>>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_UNIT, query],
    queryFn: async () => {
      return (await UnitApi.findAll(query)).data;
    },
  });
};

const useQueryUnit = (id: number) => {
  return useQuery<Unit>({
    queryKey: [TANSTACK_KEY_CONST.QUERY_UNIT, id],
    queryFn: async () => {
      return (await UnitApi.findOne(id)).data;
    },
    enabled: !!id,
  });
};

export { useQueryUnits, useQueryUnit };
