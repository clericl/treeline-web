import classnames from 'classnames'
import { CircularProgress } from "@mui/material"
import { GeolocateControl, useMap } from "react-map-gl"
import { GeolocateControl as GeolocateControlBase } from 'mapbox-gl'
import { createPortal } from "react-dom"
import { useCallback, useEffect, useRef, useState } from "react"

type GeocontrolModalProps = {
  open: boolean
}

function GeocontrolModal({ open }: GeocontrolModalProps) {
  return (
    <div className={
      classnames(
        'absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center transition-opacity duration-700 ease-in-out font-mui',
        {
          'opacity-1': open,
          'opacity-0': !open,
          'pointer-events-none': !open,
        }
      )
    }>
      <div className="flex flex-col items-center space-y-2">
        <CircularProgress sx={{ color: 'white' }} />
        <span className="text-white text-xl">Waiting for location</span>
      </div>
    </div>
  )
}

export default function Geocontrol() {
  const [open, setOpen] = useState(false)
  const map = useMap()
  const canvasElement = map.current?.getCanvasContainer().parentElement
  const geocontrolRef = useRef<GeolocateControlBase>(null)

  const handleMapLoad = useCallback(() => {
    geocontrolRef.current?.trigger()
  }, [])

  useEffect(() => {
    map.current?.on('load', handleMapLoad)
  }, [handleMapLoad, map])

  useEffect(() => {
    if (canvasElement) {
      canvasElement.style.pointerEvents = open ? 'none' : 'all'
    }
  }, [canvasElement, open])

  return (
    <>
      <GeolocateControl
        onError={() => setOpen(false)}
        onGeolocate={() => setOpen(false)}
        onTrackUserLocationEnd={() => setOpen(false)}
        onTrackUserLocationStart={() => setOpen(true)}
        showAccuracyCircle={false}
        positionOptions={{
          enableHighAccuracy: true,
        }}
        showUserHeading={true}
        trackUserLocation={true}
        ref={geocontrolRef}
      />
      {canvasElement && createPortal(
        <GeocontrolModal open={open} />,
        canvasElement
      )}
    </>
  )
}
