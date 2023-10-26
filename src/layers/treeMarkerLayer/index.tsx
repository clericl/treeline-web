import { MapStyle } from '@/zustand'
import { ScatterplotLayer } from '@deck.gl/layers/typed'
import { SpeciesDetailsType, TreeMarkerType } from "@/types"
import { speciesDetails } from '@/data'
import SelectedTreeLayer from '../selectedTreeLayer'

const typedSpeciesDetails: SpeciesDetailsType = speciesDetails

function getColorFromDatum(treeMarkerDatum: TreeMarkerType): [number, number, number] {
  const colorArr = typedSpeciesDetails[treeMarkerDatum.species].color

  return [
    colorArr[0],
    colorArr[1],
    colorArr[2],
  ]
}

function getPositionFromDatum(treeMarkerDatum: TreeMarkerType) {
  return [
    treeMarkerDatum.location.longitude,
    treeMarkerDatum.location.latitude,
  ]
}

function getRadiusFromDatum(treeMarkerDatum: TreeMarkerType) {
  return Math.pow(treeMarkerDatum.diameter / 3, 1 / 2)
}

function getSelectedStatus(
  selectedId: number,
  treeMarkerDatum: TreeMarkerType,
) {
  return selectedId === treeMarkerDatum.id
}

export default function createTreeMarkerLayer(
  data: TreeMarkerType[] = [],
  mapStyle: MapStyle,
  selectedTreeId?: number,
  props?: Partial<ScatterplotLayer>,
) {
  let lineColor = [25, 25, 25]
  let highlightColor = [0, 0, 0, 100]

  if (['Dark', 'Navigation (Night)'].includes(mapStyle)) {
    lineColor = [255, 255, 255]
    highlightColor = [255, 255, 255, 100]
  }

  return new SelectedTreeLayer({
    ...props,
    autoHighlight: true,
    data,
    filled: true,
    getLineColor: lineColor as any,
    getFillColor: getColorFromDatum as any,
    getPosition: getPositionFromDatum as any,
    getLineWidth: 2,
    getRadius: getRadiusFromDatum as any,
    highlightColor,
    id: 'tree-point-layer',
    lineWidthMaxPixels: 2,
    lineWidthMinPixels: 2,
    opacity: 0.7,
    pickable: true,
    radiusMinPixels: 8,
    radiusScale: 6,
    radiusUnits: 'pixels',
    stroked: true,
    // @ts-ignore
    selected: getSelectedStatus,
  })
}
