import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { DeletePaymentUseCase } from "@core/use-cases/payments/delete-payment";

export const deletePaymentSchema = z.object({
  params: z.object({
    id: z.string().cuid2().openapi({ description: "Payment ID" }),
  }),
});

export async function deletePaymentController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const {
      params: { id },
    } = deletePaymentSchema.parse(request);

    const deletePaymentUseCase = container.resolve<DeletePaymentUseCase>(
      "deletePaymentUseCase"
    );

    await deletePaymentUseCase.execute({ id });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
