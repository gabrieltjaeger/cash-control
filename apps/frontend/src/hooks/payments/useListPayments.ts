import {
  listPayments as listPaymentsAction,
  ListPaymentsRequest,
} from "@/_actions/payments/GET/list-payments";
import { PaymentDTO } from "@/interfaces/dtos/payment-dto";
import { useQuery } from "@tanstack/react-query";

interface ListPaymentsResponse {
  payments: PaymentDTO[];
  pagination: { next: number | null; prev: number | null };
}

export function useListPayments({
  initialDate,
  finalDate,
  timeZone,
  selectBy,
  page,
}: Omit<ListPaymentsRequest, "perPage">) {
  return useQuery<ListPaymentsResponse, Error>({
    queryKey: ["payments", initialDate, finalDate, timeZone, selectBy, page],
    queryFn: async () => {
      const response = await listPaymentsAction({
        initialDate,
        finalDate,
        timeZone,
        selectBy,
        page,
      });
      return response.data;
    },
    enabled: !!initialDate && !!finalDate && !!timeZone,
  });
}
