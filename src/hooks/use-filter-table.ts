import { useState } from "react";

export const useFilterTable = <T>() => {
  const [filters, setFilters] = useState<T>({
    page: 1,
    take: 15,
    pagination: true,
    orderBy: undefined,
    order: undefined,
  } as T);
  const [query, setQuery] = useState<T>({
    page: 1,
    take: 15,
    pagination: true,
    orderBy: undefined,
    order: undefined,
  } as T);

  return { filters, setFilters, query, setQuery };
};
