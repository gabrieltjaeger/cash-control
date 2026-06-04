"use server";

import fetchService from "@/services/fetch-service";

export interface ListPaymentsRequest {
  initialDate: string;
  finalDate?: string | null;
  timeZone?: string | null;
  selectBy: "day" | "month" | "year" | "range";
  page: number;
  perPage?: number | null;
}

export async function listPayments(data: ListPaymentsRequest) {
  const url =
    "/payments?" + new URLSearchParams(Object.entries(data)).toString();
  console.log(url);
  const response = fetchService.GET({
    url: `${process.env.API_URL}${url}`,
  });

  return response;
}
