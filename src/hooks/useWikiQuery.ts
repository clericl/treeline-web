import { useQuery } from "@tanstack/react-query"

export function useWikiQuery(pageTitle: string) {
  const queryRes = useQuery({
    queryKey: [
      'wiki',
      { pageTitle },
    ],
    queryFn: async () => {
      if (!pageTitle) return ''

      const apiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURI(pageTitle)
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
