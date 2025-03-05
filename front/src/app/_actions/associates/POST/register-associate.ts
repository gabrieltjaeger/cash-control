"use server";

interface RegisterAssociateRequest {
  fullName: string;
  email: string;
  phone: string;
}

export async function registerAssociate(
  data: RegisterAssociateRequest
): Promise<Response> {
  const response = await fetch(`${process.env.API_URL}/associates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
