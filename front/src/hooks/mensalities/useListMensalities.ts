import {
  listMensalities as listMensalitiesAction,
  ListMensalitiesRequest,
} from "@/_actions/mensalities/GET/list-mensalities";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";
import { useCallback, useEffect, useState } from "react";

export function useListMensalities({ year }: ListMensalitiesRequest) {
  const [data, setData] = useState<MensalityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const listMensalities = useCallback(async () => {
    setIsLoading(true);

    const response = await listMensalitiesAction({ year });
    if (response.message) {
      return;
    }

    setData(await response.data);
  }, [year]);

  useEffect(() => {
    listMensalities().finally(() => setIsLoading(false));
  }, [listMensalities]);

  return { data, isLoading };
}
