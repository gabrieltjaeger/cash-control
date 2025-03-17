import {
  listPayments as listPaymentsAction,
  ListPaymentsRequest,
} from "@/_actions/payments/GET/list-payments";
import { PaymentDTO } from "@/interfaces/dtos/payment-dto";
import { useCallback, useEffect, useState } from "react";

export function useListPayments({
  initialDate,
  finalDate,
  timeZone,
  selectBy,
  page,
}: Omit<ListPaymentsRequest, "perPage">) {
  const [data, setData] = useState<{
    payments: PaymentDTO[];
    pagination: { next: number | null; prev: number | null };
  }>({ payments: [], pagination: { next: null, prev: null } });
  const [isLoading, setIsLoading] = useState(false);

  const listPayments = useCallback(async () => {
    setIsLoading(true);

    const response = await listPaymentsAction({
      initialDate,
      finalDate,
      timeZone,
      selectBy,
      page,
    });
    if (response.message) {
      return;
    }
    setData(await response.data);
  }, [initialDate, finalDate, timeZone, selectBy, page]);

  useEffect(() => {
    listPayments().finally(() => setIsLoading(false));
  }, [listPayments]);

  return { data, isLoading };
}
