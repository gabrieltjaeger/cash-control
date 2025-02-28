import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { RegisterMensalityUseCase } from "@core/use-cases/mensalities/register-mensality";

export const registerMensalitySchema = {
  body: z.object({
    month: z
      .enum([
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ])
      .openapi({ description: "Mensality month" }),
    year: z
      .number()
      .int()
      .positive()
      .openapi({ description: "Mensality year" }),
    priceInCents: z.coerce
      .number()
      .int()
      .positive()
      .transform((value) => BigInt(value))
      .openapi({ description: "Mensality value in cents" }),
  }),
};

export async function registerMensalityController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { month, year, priceInCents } = registerMensalitySchema.body.parse(
      request.body
    );

    const registerMensalityUseCase =
      container.resolve<RegisterMensalityUseCase>("registerMensalityUseCase");

    await registerMensalityUseCase.execute({ month, year, priceInCents });

    return response.status(201).send();
  } catch (error) {
    next(error);
  }
}
