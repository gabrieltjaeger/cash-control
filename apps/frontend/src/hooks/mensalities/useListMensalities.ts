import {
  listMensalities as listMensalitiesAction,
  ListMensalitiesRequest,
} from "@/_actions/mensalities/GET/list-mensalities";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";
import { useQuery } from "@tanstack/react-query";

export function useListMensalities({ year }: ListMensalitiesRequest) {
  return useQuery<MensalityDTO[], Error>({
    queryKey: ["mensalities", year],
    queryFn: async () => {
      const response = await listMensalitiesAction({ year });
      return response.data;
    },
    enabled: !!year,
  });
}
