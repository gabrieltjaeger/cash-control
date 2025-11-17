import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { UpdateMensalityUseCase } from "@core/use-cases/mensalities/update-mensality";

export const updateMensalitySchema = z.object({
  params: z.object({
    id: z.string().cuid2().openapi({ description: "Mensality ID" }),
  }),
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
      .optional()
      .openapi({ description: "Mensality month" }),
    year: z
      .number()
      .int()
      .positive()
      .optional()
      .openapi({ description: "Mensality year" }),
    priceInCents: z.coerce
      .bigint()
      .positive()
      .transform((value) => BigInt(value))
      .optional()
      .openapi({ description: "Mensality value in cents" }),
  }),
});

export async function updateMensalityController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const {
      params: { id },
      body: { month, year, priceInCents },
    } = updateMensalitySchema.parse(request);

    if (
      month === undefined &&
      year === undefined &&
      priceInCents === undefined
    ) {
      throw new Error("At least one field must be provided for update");
    }

    const updateMensalityUseCase = container.resolve<UpdateMensalityUseCase>(
      "updateMensalityUseCase"
    );

    await updateMensalityUseCase.execute({ id, month, year, priceInCents });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
