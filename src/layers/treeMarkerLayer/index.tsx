import { MapStyle } from '@/zustand'
import { ScatterplotLayer } from '@deck.gl/layers/typed'
import { SpeciesDetailsType, TreeMarkerType } from "@/types"
import { speciesDetails } from '@/data'

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

function getLineColor(
  treeMarkerDatum: TreeMarkerType,
  baseLineColor: number[],
  animationCycle: number,
  selectedMarkerId?: number,
) {
  console.log(animationCycle)
  
  if (selectedMarkerId !== treeMarkerDatum.id) {
    return baseLineColor
  }

  // return animationCycle % 2 === 0 ? baseLineColor : [128, 128, 255]
  return [0, 0, 0]
}

export default function createTreeMarkerLayer(
  data: TreeMarkerType[] = [],
  mapStyle: MapStyle,
  selectedMarkerId?: number,
  props?: Partial<ScatterplotLayer>,
) {
  let lineColor = [25, 25, 25]
  let highlightColor = [0, 0, 0, 100]

  if (['Dark', 'Navigation (Night)'].includes(mapStyle)) {
    lineColor = [255, 255, 255]
    highlightColor = [255, 255, 255, 100]
  }

  let animationCycle = 0

  return new ScatterplotLayer({
    ...props,
    autoHighlight: true,
    data,
    filled: true,
    getLineColor: (d) => getLineColor(d, lineColor, animationCycle, selectedMarkerId) as any,
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
    transitions: {
      getLineColor: {
        duration: 10000,
        onEnd: () => {
          animationCycle += 1
          console.log(animationCycle)
        },
      }
    },
    updateTriggers: {
      getLineColor: [selectedMarkerId],
    },
  })
}
