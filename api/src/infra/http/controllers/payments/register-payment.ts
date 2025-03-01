import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { RegisterPaymentUseCase } from "@core/use-cases/payments/register-payment";

export const registerPaymentSchema = {
  body: z.object({
    associateId: z.string().cuid2().openapi({ description: "Associate ID" }),
    date: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return null;
        return new Date(value);
      })
      .openapi({ description: "Payment date" }),
    mensalities: z.array(
      z.object({
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
      })
    ),
  }),
};

export async function registerPaymentController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { associateId, date, mensalities } = registerPaymentSchema.body.parse(
      request.body
    );

    const registerPaymentUseCase = container.resolve<RegisterPaymentUseCase>(
      "registerPaymentUseCase"
    );

    await registerPaymentUseCase.execute({
      associateId,
      date: date ?? new Date(),
      mensalities,
    });

    return response.status(201).send();
  } catch (error) {
    next(error);
  }
}
