import {
  fetchAssociate as fetchAssociateAction,
  FetchAssociateRequest,
} from "@/_actions/associates/GET/fetch-associate";

import { AssociateDTO } from "@/interfaces/dtos/associate-dto";

import { useCallback, useEffect, useState } from "react";

export function useFetchAssociate({ id }: FetchAssociateRequest) {
  const [data, setData] = useState<AssociateDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssociate = useCallback(async () => {
    setIsLoading(true);

    const response = await fetchAssociateAction({ id });
    if (response.message) {
      return;
    }

    setData(await response.data);
  }, [id]);

  useEffect(() => {
    fetchAssociate().finally(() => setIsLoading(false));
  }, [fetchAssociate]);

  return { data, isLoading };
}
