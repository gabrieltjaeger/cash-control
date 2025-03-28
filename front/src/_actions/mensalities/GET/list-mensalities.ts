"use server";

import fetchService from "@/services/fetch-service";

export interface ListMensalitiesRequest {
  year: number;
}

export async function listMensalities(data: ListMensalitiesRequest) {
  const response = fetchService.GET({
    url: `${process.env.API_URL}/mensalities?year=${data.year}`,
  });

  return response;
}
