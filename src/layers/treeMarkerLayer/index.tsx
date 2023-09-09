import { ScatterplotLayer } from '@deck.gl/layers/typed'
import { speciesDetails } from '@/data'

import type { SpeciesDetailsType, TreeMarkerType } from "@/types"
import { MapParams } from '@/components/ReactMap'

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

function getRadiusFromDatum(
  treeMarkerDatum: TreeMarkerType,
  mapParams: MapParams,
) {
  // console.log(mapParams.zoom)
  // const factor = 40075016.686 * Math.cos(mapParams.latitude * (Math.PI / 180)) / Math.pow(2, mapParams.zoom + 1)
  // return ((treeMarkerDatum.diameter + 8) * 8) / factor
  return treeMarkerDatum.diameter
}
 
export default function createTreeMarkerLayer(
  data: TreeMarkerType[] = [],
  mapParams: MapParams,
) {
  return new ScatterplotLayer({
    id: 'tree-point-layer',
    data,
    getLineColor: [255, 255, 255],
    getFillColor: getColorFromDatum as any,
    getPosition: getPositionFromDatum as any,
    getLineWidth: 2,
    getRadius: (d) => getRadiusFromDatum(d, mapParams),
    radiusScale: 0.00001,
    filled: true,
    stroked: true,
    radiusUnits: 'meters',
    pickable: true,
    radiusMinPixels: 5,
    lineWidthMaxPixels: 2,
  })
}
