import { MapStyle } from '@/zustand'
import { ScatterplotLayer } from '@deck.gl/layers/typed'
import { SpeciesDetailsType, TreeMarkerType } from "@/types"
import { speciesDetails } from '@/data'

const typedSpeciesDetails: SpeciesDetailsType = speciesDetails

function getColorFromDatum(treeMarkerDatum: TreeMarkerType): [number, number, number, [number]] {
  const colorArr = typedSpeciesDetails[treeMarkerDatum.species].color

  return [
    colorArr[0],
    colorArr[1],
    colorArr[2],
    [colorArr[3]],
  ]
}

function getPositionFromDatum(treeMarkerDatum: TreeMarkerType) {
  return [
    treeMarkerDatum.location.longitude,
    treeMarkerDatum.location.latitude,
  ]
}

function getRadiusFromDatum(treeMarkerDatum: TreeMarkerType) {
  return Math.pow(treeMarkerDatum.diameter / 2.5, 1 / 2)
}
 
export default function createTreeMarkerLayer(
  data: TreeMarkerType[] = [],
  mapStyle: MapStyle,
) {
  let lineColor = [25, 25, 25]

  if (['Dark', 'Navigation (Night)'].includes(mapStyle)) {
    lineColor = [255, 255, 255]
  }

  return new ScatterplotLayer({
    id: 'tree-point-layer',
    data,
    getLineColor: lineColor as any,
    getFillColor: getColorFromDatum as any,
    getPosition: getPositionFromDatum as any,
    getLineWidth: 2,
    getRadius: (d) => getRadiusFromDatum(d),
    radiusScale: 6,
    filled: true,
    stroked: true,
    radiusUnits: 'pixels',
    pickable: true,
    radiusMinPixels: 8,
    lineWidthMaxPixels: 2,
    lineWidthMinPixels: 2,
  })
}
