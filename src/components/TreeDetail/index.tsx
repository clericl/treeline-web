import { Box, CircularProgress, Link, Typography, useMediaQuery, useTheme } from "@mui/material"
import { SpeciesDetailsType } from "@/types"
import { speciesDetails } from "@/data"
import { useMemo } from "react"
import { useWikiQuery } from "@/hooks"
import { useSelectedTree } from "@/zustand"
import { useGeocode } from "@/hooks/useGeocode"
import classNames from "classnames"
import { AddressComponent } from "@googlemaps/google-maps-services-js"

const typedSpeciesDetails: SpeciesDetailsType = speciesDetails

const buildAddressFromComponents = (components: AddressComponent[]) => {
  console.log(components)
  const streetNumber = components.find((component) => component.types.find((type) => type === 'street_number'))?.['long_name'] || ''
  const route = components.find((component) => component.types.find((type) => type === 'route'))?.['short_name'] || ''
  const sublocality = components.find((component) => component.types.find((type) => type === 'sublocality'))?.['long_name'] || ''
  const adminArea = components.find((component) => component.types.find((type) => type === 'administrative_area_level_1'))?.['short_name'] || ''
  const postalCode = components.find((component) => component.types.find((type) => type === 'postal_code'))?.['long_name'] || ''
  
  const plusCode = components.find((component) => component.types.find((type) => type === 'plus_code'))?.['long_name'] || ''
  const locality = components.find((component) => component.types.find((type) => type === 'locality'))?.['long_name'] || ''

  if (streetNumber && route) {
    return [
      streetNumber + ' ' + route,
      sublocality + ', ' + adminArea + ' ' + postalCode,
    ]
  } else if (plusCode) {
    return [
      plusCode,
      locality + ', ' + adminArea,
    ]
  } else {
    return null
  }
}

export default function TreeDetail() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const selectedTree = useSelectedTree.use.tree()

  const selectedTreeLatLng = useMemo(() => selectedTree ? {
    lat: selectedTree?.location.latitude,
    lng: selectedTree?.location.longitude,
  } : undefined, [selectedTree])

  const {
    data: locationData,
    isLoading: locationLoading,
  } = useGeocode(selectedTreeLatLng || '')

  const address = useMemo((): string[] | null => {
    return locationData ? buildAddressFromComponents(locationData.data[0]['address_components']) : null
  }, [locationData])

  const wikiTitle = useMemo(() => {
    if (selectedTree?.species) {
      const speciesDetail = typedSpeciesDetails[selectedTree.species]
      const latinName = selectedTree.species.split(' \'')[0]
      return speciesDetail.wikiTitle || latinName
    }

    return ''
  }, [selectedTree])

  const { data: wikiData, isLoading: wikiLoading } = useWikiQuery(wikiTitle)

  return (
    <Box sx={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
      <Box sx={{ pb: 3, pt: isMobile ? 1 : 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'var(--font-mui)',
            fontStyle: selectedTree?.species ? 'italic' : 'normal',
            lineHeight: 1.1,
          }}
        >{(selectedTree?.species || 'Unknown')}</Typography>
        {selectedTree?.species && (
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-mui)',
              lineHeight: 1.1,
              marginTop: 1,
            }}
          >{typedSpeciesDetails[selectedTree?.species].commonNames}</Typography>
        )}
        <Typography
          component="div"
          variant="body2"
          sx={{
            fontFamily: 'var(--font-mui)',
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          <p className="w-full flex justify-between">
            <span className="mb-2">Condition</span>
            <span
              className={
                classNames(
                  'text-right',
                  {
                    'text-red-600': selectedTree?.condition === 'Critical',
                    'text-orange-500': selectedTree?.condition === 'Poor',
                    'text-lime-400': selectedTree?.condition === 'Fair',
                    'text-green-600': selectedTree?.condition === 'Good',
                    'text-emerald-700': selectedTree?.condition === 'Excellent',
                    'text-gray-400': selectedTree?.condition === 'Dead',
                    'text-purple-600': selectedTree?.condition === 'Unknown',
                  }
                )
              }
            >
              &nbsp;{selectedTree?.condition}{selectedTree?.structure === 'Stump' && ' (stump)'}
            </span>
          </p>
          <p className="w-full flex justify-between mb-2">
            <span>Diameter</span>
            <span className="text-right">{selectedTree?.diameter} in.</span>
          </p>
          <p className="w-full flex justify-between mb-2">
            <span>Longitude</span>
            <span className="text-right">{selectedTree?.location.longitude}</span>
          </p>
          <p className="w-full flex justify-between mb-2">
            <span>Latitude</span>
            <span className="text-right">{selectedTree?.location.latitude}</span>
          </p>
          {(address || locationLoading) && (
            <p className="w-full flex justify-between mb-2">
              <span className="whitespace-nowrap mr-2">Closest address</span>
              <span className="text-right">
                {address ? address[0] : 'Finding...'}
                <br></br>
                {address && address[1]}
              </span>
            </p>
          )}
        </Typography>
        {(wikiLoading || !wikiData) ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
            <CircularProgress size="small" sx={{ color: 'white' }} />
          </Box>
        ) : (
          <Box>
            <Typography
              component="div"
              variant="body2"
              sx={{
                fontFamily: 'var(--font-mui)',
                lineHeight: 1.25,
                marginTop: 2,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: wikiData.extract_html }}></div>
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              <Link
                href={wikiData.content_urls.desktop.page}
                rel="noopener"
                target="_blank"
              >
                Read more (Wikipedia) ❯
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
