import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { ListPaymentsUseCase } from "@core/use-cases/payments/list-payments";

import { PaymentPresenter } from "@infra/http/presenters/payment-presenter";

export const listPaymentsSchema = {
  query: z.object({
    initialDate: z
      .string()
      .openapi({
        description: "Date",
      })
      .transform((value) => {
        return new Date(value);
      }),
    finalDate: z
      .string()
      .optional()
      .openapi({
        description: "Date",
      })
      .transform((value) => {
        return value ? new Date(value) : null;
      }),
    timeZone: z.string().default("Etc/GMT").openapi({
      description: "Time zone",
    }),
    selectBy: z.enum(["day", "month", "year", "range"]).openapi({
      description: "Select by",
    }),
    page: z.coerce.number().int().positive().optional().openapi({
      description: "Page number",
    }),
    perPage: z.coerce.number().int().positive().optional().openapi({
      description: "Payments per page",
    }),
  }),
};

export async function listPaymentsController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { initialDate, finalDate, timeZone, selectBy, page, perPage } =
      listPaymentsSchema.query.parse(request.query);

    const listPaymentsUseCase = container.resolve<ListPaymentsUseCase>(
      "listPaymentsUseCase"
    );

    const { payments } = await listPaymentsUseCase.execute({
      initialDate,
      finalDate,
      timeZone,
      selectBy,
      page,
      take: perPage,
    });

    return response.status(200).send({
      payments: payments.map((payment) => PaymentPresenter.toDTO(payment)),
      pagination: { next: payments.next, prev: payments.prev },
    });
  } catch (error) {
    next(error);
  }
}
