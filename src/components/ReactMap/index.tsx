'use client'

import Geocontrol from '../Geocontrol'
import createTreeMarkerLayer from '../../layers/treeMarkerLayer'
//@ts-expect-error
import distance from '@turf/distance'
import geoViewport from '@mapbox/geo-viewport'
import { Map, MapRef, ViewStateChangeEvent, useControl } from 'react-map-gl'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { PickingInfo } from '@deck.gl/core/typed'
import { StylesList, useMapStyle } from '../../zustand'
import { SpeciesDetailsType, TreeMarkerType } from '@/types'
import { speciesDetails } from "@/data"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelectedSpecies } from '@/zustand/useSelectedSpecies'
import { useTreesQuery } from '@/hooks/useTreesQuery'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const typedSpeciesDetails: SpeciesDetailsType = speciesDetails

export const MAP_STYLES: StylesList = {
  'Streets': 'mapbox://styles/mapbox/streets-v12',
  'Outdoors': 'mapbox://styles/mapbox/outdoors-v12',
  'Light': 'mapbox://styles/mapbox/light-v11',
  'Dark': 'mapbox://styles/mapbox/dark-v11',
  'Satellite': 'mapbox://styles/mapbox/satellite-v9',
  'Satellite & Streets': 'mapbox://styles/mapbox/satellite-streets-v12',
  'Navigation (Day)': 'mapbox://styles/mapbox/navigation-day-v1',
  'Navigation (Night)': 'mapbox://styles/mapbox/navigation-night-v1',
}

export const INITIAL_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -73.9872,
  zoom: 15,
  maxZoom: 20,
  minZoom: 12,
}

export type MapParams = {
  latitude: number;
  longitude: number;
  radius: number;
  zoom: number;
}

function DeckGLOverlay(props: MapboxOverlayProps & {
  interleaved?: boolean;
}) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  
  return null
}

export default function ReactMap() {
  const [mapParams, setMapParams] = useState<MapParams>({
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
    radius: 1.04232281904622,
    zoom: 15,
  })
  const [treeData, setTreeData] = useState<TreeMarkerType[]>([])
  const { data } = useTreesQuery(mapParams)
  const mapRef = useRef<MapRef>(null)
  const mapStyle = useMapStyle.use.style()
  const selectedSpecies = useSelectedSpecies.use.species()

  const getTooltip = useCallback(({ object }: PickingInfo) => {
    if (!object) return null

    const speciesDetail = typedSpeciesDetails[object.species]
    
    return {
      html: `
        <div>
          <p class="text-base"><i>${object.species}</i></p>
          <p>${speciesDetail.commonNames}</p>
        </div>
      `,
      className: '',
      style: {
        borderRadius: '5px',
        backgroundColor: 'black',
      },
    }
  }, [])

  const handleViewStateChange = useCallback(({ viewState }: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = viewState
    const canvas = mapRef.current?.getCanvas()

    let width = 1
    let height = 1

    if (canvas) {
      width = canvas.width
      height = canvas.height
    }
    
    const bounds = geoViewport.bounds(
      { lon: longitude, lat: latitude },
      zoom,
      [width, height],
      512,
    )
    const distanceBetween = distance(
      [bounds[0], latitude],
      [bounds[2], latitude],
    )
    const radius = selectedSpecies.size ?
      distanceBetween / 2 :
      Math.min(distanceBetween / 2, 2)

    setMapParams({
      latitude,
      longitude,
      radius,
      zoom,
    })
  }, [selectedSpecies])

  const layers = useMemo(() => ([
    createTreeMarkerLayer(treeData, mapStyle)
  ]), [treeData, mapStyle])

  useEffect(() => {
    if (typeof data !== 'undefined') {
      setTreeData(data)
    }
  }, [data])

  return (
    <Map
      initialViewState={INITIAL_VIEW_STATE}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={MAP_STYLES[mapStyle]}
      onMoveEnd={handleViewStateChange}
      ref={mapRef}
    >
      <DeckGLOverlay
        getTooltip={getTooltip}
        interleaved={true}
        layers={layers}
      />
      <Geocontrol />
    </Map>
  )
}
