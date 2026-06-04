import {
  fetchAssociate as fetchAssociateAction,
  FetchAssociateRequest,
} from "@/_actions/associates/GET/fetch-associate";

import { AssociateDTO } from "@/interfaces/dtos/associate-dto";
import { useQuery } from "@tanstack/react-query";

export function useFetchAssociate({ id }: FetchAssociateRequest) {
  return useQuery<AssociateDTO, Error>({
    queryKey: ["associate", id],
    queryFn: async () => {
      const response = await fetchAssociateAction({ id });
      return response.data;
    },
    enabled: !!id,
  });
}
