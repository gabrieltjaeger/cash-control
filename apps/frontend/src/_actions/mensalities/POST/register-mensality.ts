"use server";

import fetchService from "@/services/fetch-service";

import { Month } from "@/types/month";

interface RegisterMensalityRequest {
  month: Month;
  year: number;
  priceInCents: string;
}

export async function registerMensality(data: RegisterMensalityRequest) {
  const response = fetchService.POST({
    url: `${process.env.API_URL}/mensalities`,
    data: {
      month: data.month,
      year: data.year,
      priceInCents: data.priceInCents.toString().normalize(),
    },
  });

  return response;
}
