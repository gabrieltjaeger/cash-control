"use server";

import fetchService from "@/services/fetch-service";

import { Month } from "@/types/month";

interface RegisterMensalityRequest {
  month: Month;
  year: number;
  priceInCents: bigint;
}

export async function registerMensality(data: RegisterMensalityRequest) {
  const response = fetchService.POST({
    url: `${process.env.API_URL}/mensalities`,
    data,
  });

  return response;
}
