import { TreeMarkerType } from '@/types';
import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface SelectedTreeState {
  tree: TreeMarkerType | null;
  set: (tree: TreeMarkerType | null) => void,
}

const useSelectedTreeBase = create<SelectedTreeState>()((set) => ({
  tree: null,
  set: (tree: TreeMarkerType | null) => set(() => ({ tree })),
}))

export const useSelectedTree = createSelectors(useSelectedTreeBase)
