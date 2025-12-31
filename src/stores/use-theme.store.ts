import { LOCAL_STORAGE_CONST } from "@constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeType = "light" | "dark";

type Store = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<Store>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: ThemeType) => {
        set({ theme });
      },
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: LOCAL_STORAGE_CONST.THEME,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
