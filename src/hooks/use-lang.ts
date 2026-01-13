import { useLangStore } from "@stores";
import { useQueryLangs } from "./lang";
import { useCallback, useMemo } from "react";

export const useLang = () => {
  const { lang } = useLangStore();

  const { data, isLoading } = useQueryLangs({ pagination: false });

  const langMap = useMemo(() => {
    if (!data?.entities || data.entities.length === 0) return {};

    return data.entities.reduce<Record<string, string>>((acc, item) => {
      acc[item.code] = item[lang];
      return acc;
    }, {});
  }, [data, lang]);

  const t = useCallback((code: string) => langMap[code] ?? code, [langMap]);

  return {
    t,
    lang,
    isLoading,
  };
};
