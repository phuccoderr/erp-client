import { useCallback, useMemo, useState } from "react";
import { useLang } from "./use-lang";
import { LANG_KEY_CONST } from "@constants";

export const useFilterTable = <T>() => {
  const { t, data: langs } = useLang();

  const [filters, setFilters] = useState<T>({
    page: 1,
    take: 15,
    pagination: false,
    orderBy: undefined,
    order: undefined,
  } as T);
  const [query, setQuery] = useState<T>({
    page: 1,
    take: 15,
    pagination: false,
    orderBy: undefined,
    order: undefined,
  } as T);

  function resetSort() {
    setFilters((prev) => ({
      ...prev,
      orderBy: undefined,
      order: undefined,
    }));
    setQuery((prev) => ({
      ...prev,
      orderBy: undefined,
      order: undefined,
    }));
  }

  const sortOptions = useMemo(
    () => [
      { value: "asc", label: t(LANG_KEY_CONST.COMMON_ASC) },
      { value: "desc", label: t(LANG_KEY_CONST.COMMON_DESC) },
    ],
    [langs],
  );

  const handleOrderBy = useCallback((value: string) => {
    const orderBy = value as keyof T;
    setFilters((prev) => ({
      ...prev,
      orderBy,
    }));
  }, []);

  const handleOrder = useCallback((value: string) => {
    const order = value === "desc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      order,
    }));
  }, []);

  return {
    filters,
    setFilters,
    query,
    setQuery,
    resetSort,
    sortOptions,
    handleOrderBy,
    handleOrder,
  };
};
