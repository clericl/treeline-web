import { useQuery } from "@tanstack/react-query"
import { useSelectedTree } from "@/zustand"

export function useTreeQuery() {
  const selectedTree = useSelectedTree.use.tree()

  const queryRes = useQuery({
    queryKey: [
      'tree',
      { id: selectedTree?.id },
    ],
    queryFn: async () => {
      if (selectedTree) {
        const apiUrl = new URL(window.location.origin + '/api/tree/' + selectedTree?.id)
        const dataRes = await fetch(apiUrl)
    
        if (!dataRes.ok) {
          throw new Error('something went wrong!')
        }
        
        const { data } = await dataRes.json()
        return data
      } else {
        return null
      }
    },
  })

  return queryRes
}
