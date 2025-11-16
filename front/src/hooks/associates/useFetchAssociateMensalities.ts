import {
  fetchAssociateMensalities as fetchAssociateMensalitiesAction,
  FetchAssociateMensalitiesRequest,
} from "@/_actions/associates/GET/fetch-associate-mensalities";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";
import { useQuery } from "@tanstack/react-query";

export function useFetchAssociateMensalities({
  id,
  year,
}: FetchAssociateMensalitiesRequest) {
  return useQuery<MensalityDTO[], Error>({
    queryKey: ["associate-mensalities", id, year],
    queryFn: async () => {
      const response = await fetchAssociateMensalitiesAction({ id, year });
      return response.data;
    },
    enabled: !!id && !!year,
  });
}
