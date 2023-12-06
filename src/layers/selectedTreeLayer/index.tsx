import { TreeMarkerType } from "@/types";
import { IconLayer } from "@deck.gl/layers/typed";
import { MapStyle } from "@/zustand";

function getPositionFromDatum(treeMarkerDatum: TreeMarkerType) {
  console.log(treeMarkerDatum)
  return [
    treeMarkerDatum.location.longitude,
    treeMarkerDatum.location.latitude,
  ]
}

export default function createSelectedTreeLayer(
  data: TreeMarkerType | null,
  mapStyle: MapStyle,
  props?: Partial<IconLayer>,
) {
  const wrappedData = data ? [data] : []

  let lineColor = [25, 25, 25]

  if (['Dark', 'Navigation (Night)'].includes(mapStyle)) {
    lineColor = [255, 255, 255]
  }

  return new IconLayer({
    ...props,
    autoHighlight: true,
    data: wrappedData,
    getColor: lineColor as any,
    getIcon: () => 'marker',
    getPosition: getPositionFromDatum as any,
    getSize: 10,
    iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }
    },
    id: 'selected-tree-layer',
    pickable: true,
    sizeScale: 4,
  })
}
