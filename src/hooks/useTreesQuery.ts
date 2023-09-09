import { MapParams } from "@/components/ReactMap"
import { useQuery } from "@tanstack/react-query"

export function useTreesQuery(mapParams: MapParams) {
  const { latitude, longitude, radius } = mapParams

  const queryRes = useQuery(
    [
      'trees',
      latitude,
      longitude,
      radius,
    ],
    async () => {
      const apiUrl = new URL(
        window.location.origin +
        '/api/trees' +
        `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      )

      const dataRes = await fetch(apiUrl)

      if (!dataRes.ok) {
        throw new Error('something went wrong!')
      }
      
      const { data } = await dataRes.json()
      return data
    },
  )

  return queryRes
}
