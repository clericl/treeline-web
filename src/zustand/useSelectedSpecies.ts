import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export type SpeciesOption = {
  id: string;
  title: string;
  color: number[];
}

export interface SelectedSpeciesState {
  species: Set<SpeciesOption>,
  add: (species: SpeciesOption) => void,
  remove: (id: string) => void,
}

const useSelectedSpeciesBase = create<SelectedSpeciesState>()((set) => ({
  species: new Set(),
  add: (species: SpeciesOption) => set((state) => {
    const newSpeciesSet = new Set(state.species)
    newSpeciesSet.add(species)

    return ({ species: newSpeciesSet })
  }),
  remove: (id: string) => set((state: SelectedSpeciesState) => {
    const newSpeciesSet = new Set(state.species)
    newSpeciesSet.forEach((item) => {
      if (item.id === id) {
        newSpeciesSet.delete(item)
      }
    })

    return ({ species: newSpeciesSet })
  })
}))

export const useSelectedSpecies = createSelectors(useSelectedSpeciesBase)
