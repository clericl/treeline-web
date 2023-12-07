import { GeolocateControl, useMap } from "react-map-gl"
import { GeolocateControl as GeolocateControlBase } from 'mapbox-gl'
import { useCallback, useEffect, useRef } from "react"
import { useModal } from '@/zustand'

export default function Geocontrol() {
  const map = useMap()
  const geocontrolRef = useRef<GeolocateControlBase>(null)
  const setGeocontrolOpen = useModal.use.setGeocontrol()
  const setOutOfRangeOpen = useModal.use.setOutOfRange()

  const handleMapLoad = useCallback(() => {
    geocontrolRef.current?.trigger()
  }, [])

  const handleOutOfMaxBounds = useCallback(() => {
    setOutOfRangeOpen(true)
    setGeocontrolOpen(false)
  }, [setGeocontrolOpen, setOutOfRangeOpen])

  useEffect(() => {
    map.current?.on('load', handleMapLoad)
  }, [handleMapLoad, map])

  return (
    <GeolocateControl
      onError={() => setGeocontrolOpen(false)}
      onGeolocate={() => setGeocontrolOpen(false)}
      onOutOfMaxBounds={handleOutOfMaxBounds}
      onTrackUserLocationEnd={() => setGeocontrolOpen(false)}
      onTrackUserLocationStart={() => setGeocontrolOpen(true)}
      showAccuracyCircle={false}
      positionOptions={{
        enableHighAccuracy: true,
      }}
      showUserHeading={true}
      trackUserLocation={true}
      ref={geocontrolRef}
    />
  ) 
}
