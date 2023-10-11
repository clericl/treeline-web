import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export type MapStyle =
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
  style: MapStyle,
  set: (newMapStyle: MapStyle) => void,
}

const useMapStyleBase = create<MapStyleState>()((set) => ({
  style: 'Navigation (Night)',
  set: (newMapStyle: MapStyle) => set(() => ({ style: newMapStyle }))
}))

export const useMapStyle = createSelectors(useMapStyleBase)
