"use server";

import fetchService from "@/services/fetch-service";

interface ListAssociatesRequest {
  page: number;
  name?: string;
}

export async function listAssociates(data: ListAssociatesRequest) {
  const response = fetchService.GET({
    url: `${process.env.API_URL}/associates?page=${data.page}${
      data.name ? `&name=${data.name}` : ""
    }`,
  });

  return response;
}
