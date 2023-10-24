import { useQuery } from "@tanstack/react-query"
import { useSelectedTree } from "@/zustand"

export function useTreeQuery() {
  const selectedTreeId = useSelectedTree.use.id()

  const queryRes = useQuery({
    queryKey: [
      'tree',
      { id: selectedTreeId },
    ],
    queryFn: async () => {
      const apiUrl = new URL(window.location.origin + '/api/tree/' + selectedTreeId)
      const dataRes = await fetch(apiUrl)
  
      if (!dataRes.ok) {
        throw new Error('something went wrong!')
      }
      
      const { data } = await dataRes.json()
      return data
    },
  })

  return queryRes
}
