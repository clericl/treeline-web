import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export type MapStyle =
  | 'Streets'
  | 'Streets'
  | 'Outdoors'
  | 'Light'
  | 'Dark'
  | 'Satellite'
  | 'Satellite & Streets'
  | 'Navigation (Day)'
  | 'Navigation (Night)'

export type StylesList = {
  [key in MapStyle]: string;
}

export interface MapStyleState {
  mapStyle: MapStyle,
  setMapStyle: (newMapStyle: MapStyle) => void,
}

const useMapStyleBase = create<MapStyleState>()((set) => ({
  mapStyle: 'Navigation (Night)',
  setMapStyle: (newMapStyle: MapStyle) => set(() => ({ mapStyle: newMapStyle }))
}))

export const useMapStyle = createSelectors(useMapStyleBase)
