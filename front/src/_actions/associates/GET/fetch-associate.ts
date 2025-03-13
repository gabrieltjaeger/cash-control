"use server";

import fetchService from "@/services/fetch-service";

interface FetchAssociateRequest {
  id: string;
}

export async function fetchAssociate(data: FetchAssociateRequest) {
  const response = fetchService.GET({
    url: `${process.env.API_URL}/associates/${data.id}`,
  });

  return response;
}
