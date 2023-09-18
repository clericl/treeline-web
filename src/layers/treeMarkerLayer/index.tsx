import { MapParams } from '@/components/ReactMap'
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

function getRadiusFromDatum(
  treeMarkerDatum: TreeMarkerType,
  mapParams: MapParams,
) {
  const scaledDiameter = (Math.pow(1.2, mapParams.zoom)) / (treeMarkerDatum.diameter + 5)
  return scaledDiameter
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
    radiusScale: 6,
    filled: true,
    stroked: true,
    radiusUnits: 'pixels',
    pickable: true,
    radiusMinPixels: 5,
    lineWidthMaxPixels: 2,
    lineWidthMinPixels: 2,
  })
}
