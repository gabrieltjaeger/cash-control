"use server";

import fetchService from "@/services/fetch-service";

import { Month } from "@/types/month";

interface RegisterPaymentRequest {
  associateId: number;
  date?: string;
  mensalities: {
    month: Month;
    year: number;
  }[];
}

export async function registerPayment(data: RegisterPaymentRequest) {
  const response = fetchService.POST({
    url: `${process.env.API_URL}/payments`,
    data,
  });

  return response;
}
