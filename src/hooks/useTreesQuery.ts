import { MapParams } from "@/components/ReactMap";
import { useQuery } from "@tanstack/react-query";
import { useSelectedSpecies } from "@/zustand";

export function useTreesQuery(mapParams: MapParams) {
  const { latitude, longitude, radius } = mapParams;
  const selectedSpecies = useSelectedSpecies.use.species();

  const queryRes = useQuery({
    queryKey: [
      "trees",
      {
        latitude,
        longitude,
        radius,
        selectedSpecies: Array.from(selectedSpecies),
      },
    ],
    queryFn: async () => {
      let apiUrl;

      if (selectedSpecies.size) {
        const speciesString = Array.from(selectedSpecies)
          .map((species) => species.id)
          .join(",");

        apiUrl = new URL(
          window.location.origin +
            "/api/species" +
            `?species=${speciesString}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        );
      } else {
        apiUrl = new URL(
          window.location.origin +
            "/api/trees" +
            `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        );
      }

      const dataRes = await fetch(apiUrl);

      if (!dataRes.ok) {
        throw new Error("something went wrong!");
      }

      const { data } = await dataRes.json();
      return data;
    },
  });

  return queryRes;
}
