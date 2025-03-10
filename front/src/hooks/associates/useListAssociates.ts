import { listAssociates as listAssociatesAction } from "@/_actions/associates/GET/list-associates";
import { AssociateDTO } from "@/interfaces/dtos/associate-dto";
import { useCallback, useEffect, useState } from "react";

interface UseListAssociatesProps {
  page: number;
  name?: string;
}

export function useListAssociates({ page, name }: UseListAssociatesProps) {
  const [data, setData] = useState<{
    associates: AssociateDTO[];
    pagination: { next: number | null; prev: number | null };
  }>({ associates: [], pagination: { next: null, prev: null } });
  const [isLoading, setIsLoading] = useState(false);

  const listAssociates = useCallback(async () => {
    setIsLoading(true);

    const response = await listAssociatesAction({ page, name });
    if (response.message) {
      return;
    }
    setData(await response.data);
  }, [page, name]);

  useEffect(() => {
    listAssociates().finally(() => setIsLoading(false));
  }, [listAssociates]);

  return { data, isLoading };
}
