import { LOCAL_STORAGE_CONST } from "@constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LangType = "vi" | "en";

type Store = {
  lang: LangType;
  setLang: (lang: LangType) => void;
};

export const useLangStore = create<Store>()(
  persist(
    (set) => ({
      lang: "vi",
      setLang: (lang: LangType) => {
        set({ lang });
      },
    }),
    {
      name: LOCAL_STORAGE_CONST.LANG,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lang: state.lang }),
    }
  )
);
