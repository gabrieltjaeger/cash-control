import {
  fetchAssociateMensalities as fetchAssociateMensalitiesAction,
  FetchAssociateMensalitiesRequest,
} from "@/_actions/associates/GET/fetch-associate-mensalities";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";

import { useCallback, useEffect, useState } from "react";

export function useFetchAssociateMensalities({
  id,
  year,
}: FetchAssociateMensalitiesRequest) {
  const [data, setData] = useState<MensalityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssociateMensalities = useCallback(async () => {
    setIsLoading(true);

    const response = await fetchAssociateMensalitiesAction({ id, year });
    if (response.message) {
      return;
    }

    setData(await response.data);
  }, [id, year]);

  useEffect(() => {
    fetchAssociateMensalities().finally(() => setIsLoading(false));
  }, [fetchAssociateMensalities]);

  return { data, isLoading };
}
