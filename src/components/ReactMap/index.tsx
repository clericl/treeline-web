'use client'

import createTreeMarkerLayer from '../../layers/treeMarkerLayer'
import debounce from 'lodash.debounce'
import distance from '@turf/distance'
import geoViewport from '@mapbox/geo-viewport'
import { DeckGL } from '@deck.gl/react/typed'
import { Map } from 'react-map-gl'
import { StylesList, useMapStyle } from '../../zustand'
import { useEffect, useMemo, useState } from 'react'
import { useTreesQuery } from '@/hooks/useTreesQuery'
import type { ViewStateChangeParameters } from '@/types'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export const MAP_STYLES: StylesList = {
  'Streets': 'mapbox://styles/mapbox/streets-v12',
  'Outdoors': 'mapbox://styles/mapbox/outdoors-v12',
  'Light': 'mapbox://styles/mapbox/light-v11',
  'Dark': 'mapbox://styles/mapbox/dark-v11',
  'Satellite': 'mapbox://styles/mapbox/satellite-v9',
  'Satellite + Streets': 'mapbox://styles/mapbox/satellite-streets-v12',
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

export default function ReactMap() {
  const [mapParams, setMapParams] = useState<MapParams>({
    latitude: INITIAL_VIEW_STATE.latitude,
    longitude: INITIAL_VIEW_STATE.longitude,
    radius: 0.2,
    zoom: 15,
  })
  const [treeData, setTreeData] = useState([])
  const { data } = useTreesQuery(mapParams)
  const mapStyle = useMapStyle.use.mapStyle()

  const layers = useMemo(() => ([
    createTreeMarkerLayer(treeData, mapParams)
  ]), [treeData, mapParams])

  const handleViewStateChange = useMemo(() => {
    return debounce(
      ({ viewState }: ViewStateChangeParameters) => {
        const { longitude, latitude, zoom, width, length } = viewState
        
        const bounds = geoViewport.bounds(
          { lon: longitude, lat: latitude },
          zoom,
          [width, length],
          512,
        )
        const distanceBetween = distance(
          [bounds[0], latitude],
          [bounds[2], latitude],
        )
        const radius = Math.min(
          distanceBetween / 2,
          2
        )

        setMapParams({
          latitude,
          longitude,
          radius,
          zoom,
        })
      },
      500,
    )
  }, [])

  useEffect(() => {
    if (data && data.length) {
      setTreeData(data)
    }
  }, [data])

  return (
    <DeckGL
      controller={true}
      initialViewState={INITIAL_VIEW_STATE}
      layers={layers}
      onViewStateChange={handleViewStateChange}
    >
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={MAP_STYLES[mapStyle]}
      />
    </DeckGL>
  )
}
