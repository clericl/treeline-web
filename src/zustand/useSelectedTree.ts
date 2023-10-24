import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface SelectedTreeState {
  id: number | null;
  set: (id: number | null) => void,
}

const useSelectedTreeBase = create<SelectedTreeState>()((set) => ({
  id: null,
  set: (id: number | null) => set(() => ({ id })),
}))

export const useSelectedTree = createSelectors(useSelectedTreeBase)
