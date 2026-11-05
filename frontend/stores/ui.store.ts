import { create } from "zustand";

interface UIStore {
  sideBarOpen: boolean;
  toggleSidebar: () => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sideBarOpen: true,
  toggleSidebar: () =>
    set((state) => ({
      sideBarOpen: !state.sideBarOpen,
    })),

  theme: "light",

  setTheme: (theme) => set({ theme }),
}));
