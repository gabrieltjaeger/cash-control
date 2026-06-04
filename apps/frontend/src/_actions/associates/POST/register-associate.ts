"use server";

import fetchService from "@/services/fetch-service";

interface RegisterAssociateRequest {
  fullName: string;
  email: string;
  phone: string;
}

export async function registerAssociate(data: RegisterAssociateRequest) {
  const response = fetchService.POST({
    url: `${process.env.API_URL}/associates`,
    data,
  });

  return response;
}
