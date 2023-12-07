import { create } from "zustand";
import { createSelectors } from "./createSelectors";

export type ModalType = "geocontrol" | "outOfRange" | "loadingData" | null;

export interface ModalState {
  geocontrol: boolean;
  outOfRange: boolean;
  loadingData: boolean;
  setGeocontrol: (newState: boolean) => void;
  setOutOfRange: (newState: boolean) => void;
  setLoadingData: (newState: boolean) => void;
}

const useModalBase = create<ModalState>()((set) => ({
  geocontrol: false,
  outOfRange: false,
  loadingData: false,
  setGeocontrol: (newState: boolean) => set(() => ({ geocontrol: newState })),
  setOutOfRange: (newState: boolean) => set(() => ({ outOfRange: newState })),
  setLoadingData: (newState: boolean) => set(() => ({ loadingData: newState })),
}));

export const useModal = createSelectors(useModalBase);
