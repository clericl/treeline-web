import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { LatLng } from "@googlemaps/google-maps-services-js"

export function useGeocode(geocodeRequest: LatLng): UseQueryResult<any, Error>
export function useGeocode(geocodeRequest: string): UseQueryResult<any, Error>
export function useGeocode(geocodeRequest: LatLng | string) {
  const queryRes = useQuery({
    queryKey: [
      'geocode',
      { geocodeRequest },
    ],
    queryFn: async () => {
      if (!geocodeRequest) return ''

      let apiUrl

      if (typeof geocodeRequest === 'string') {
        apiUrl = new URL(
          window.location.origin +
          '/api/geocode' +
          `?address=${geocodeRequest}`
        )
      } else if (Array.isArray(geocodeRequest)) {
        apiUrl = new URL(
          window.location.origin +
          '/api/geocode' +
          `?latitude=${geocodeRequest[0]}&longitude=${geocodeRequest[1]}`
        )
      } else if ('lat' in geocodeRequest && geocodeRequest.lat) {
        const { lat, lng } = geocodeRequest
        apiUrl = new URL(
          window.location.origin +
          '/api/geocode' +
          `?latitude=${lat}&longitude=${lng}`
        )
      } else if ('latitude' in geocodeRequest  && geocodeRequest.latitude) {
        const { latitude, longitude } = geocodeRequest
        apiUrl = new URL(
          window.location.origin +
          '/api/geocode' +
          `?latitude=${latitude}&longitude=${longitude}`
        )
      } else {
        return null
      }

      const dataRes = await fetch(apiUrl)
      if (!dataRes.ok) {
        throw new Error('something went wrong!')
      }
      
      const data = await dataRes.json()
      return data
    },
  })

  return queryRes
}
