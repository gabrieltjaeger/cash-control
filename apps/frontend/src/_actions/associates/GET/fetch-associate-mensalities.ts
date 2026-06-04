"use server";

import fetchService from "@/services/fetch-service";

export interface FetchAssociateMensalitiesRequest {
  id: string;
  year: number;
}

export async function fetchAssociateMensalities(
  data: FetchAssociateMensalitiesRequest
) {
  const response = fetchService.GET({
    url: `${process.env.API_URL}/associates/${data.id}/mensalities?year=${data.year}`,
  });

  return response;
}
