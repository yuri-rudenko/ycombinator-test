import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  selectedLocationId: string | null;
  setLocationId: (id: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocationId: null,
      setLocationId: (id) => set({ selectedLocationId: id }),
    }),
    {
      name: "selected-location",
    },
  ),
);
