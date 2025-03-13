"use server";

import fetchService from "@/services/fetch-service";

interface ListPaymentsRequest {
  initialDate: string;
  finalDate: string;
  timeZone: string;
  selectBy: "day" | "month" | "year" | "range";
  page: number;
}

export async function listPayments(data: ListPaymentsRequest) {
  const response = fetchService.GET({
    url: `${process.env.API_URL}/payments?initialDate=${data.initialDate}&finalDate=${data.finalDate}&timeZone=${data.timeZone}&selectBy=${data.selectBy}&page=${data.page}`,
  });

  return response;
}
