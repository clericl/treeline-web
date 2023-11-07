'use client'

import Geocontrol from '../Geocontrol'
import createTreeMarkerLayer from '../../layers/treeMarkerLayer'
//@ts-expect-error
import distance from '@turf/distance'
import geoViewport from '@mapbox/geo-viewport'
import { Map, MapRef, ViewStateChangeEvent, useControl } from 'react-map-gl'
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed'
import { PickingInfo } from '@deck.gl/core/typed'
import { SpeciesDetailsType, TreeMarkerType } from '@/types'
import {
  StylesList,
  useMapStyle,
  useSelectedSpecies,
  useSelectedTree,
} from '@/zustand'
import { alpha, useMediaQuery, useTheme } from '@mui/material'
import { speciesDetails } from "@/data"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTreesQuery } from '@/hooks'

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
  const selectedTree = useSelectedTree.use.tree()
  const setSelectedTree = useSelectedTree.use.set()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getTooltip = useCallback(({ object }: PickingInfo) => {
    if (!object) return null

    const speciesDetail = typedSpeciesDetails[object.species]
    
    return {
      html: `
        <div class="font-mui">
          <p class="text-base">${object.species ? `<i>${object.species}</i>` : 'Stump'}</p>
          <p>${speciesDetail.commonNames}</p>
        </div>
      `,
      className: '',
      style: {
        borderRadius: '5px',
        backgroundColor: alpha(theme.palette.grey[900], 0.8),
        color: 'white',
      },
    }
  }, [theme])

  const handleTreeMarkerClick = useCallback(({ object }: PickingInfo) => {
    if (object) {
      setSelectedTree(object)

      return true
    }

    return false
  }, [setSelectedTree])

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
    createTreeMarkerLayer(
      treeData,
      mapStyle,
      selectedTree?.id,
      {
        onClick: handleTreeMarkerClick,
      }
    )
  ]), [
    mapStyle,
    selectedTree,
    treeData,
    handleTreeMarkerClick,
  ])

  useEffect(() => {
    if (typeof data !== 'undefined') {
      setTreeData(data)
    }
  }, [data])

  useEffect(() => {
    if (mapRef.current && selectedTree) {
      const { location } = selectedTree

      setTimeout(() => {
        if (mapRef.current) {
          const offsetY = isMobile ? 100 : 0
          mapRef.current.panTo(
            [location.longitude, location.latitude - 0.001],
            { offset: [0, offsetY] }
          )
        }
      }, 50)
    }
  }, [isMobile, selectedTree])

  return (
    <Map
      initialViewState={INITIAL_VIEW_STATE}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={MAP_STYLES[mapStyle]}
      onMoveEnd={handleViewStateChange}
      ref={mapRef}
    >
      <DeckGLOverlay
        getCursor={() => 'inherit'}
        getTooltip={getTooltip}
        interleaved={true}
        layers={layers}
      />
      <Geocontrol />
    </Map>
  )
}
