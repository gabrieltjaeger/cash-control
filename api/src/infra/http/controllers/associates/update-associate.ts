import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { UpdateAssociateUseCase } from "@core/use-cases/associates/update-associate";

export const updateAssociateSchema = z.object({
  params: z.object({
    id: z.string().cuid2().openapi({ description: "Associate ID" }),
  }),
  body: z.object({
    fullName: z
      .string()
      .min(3)
      .max(255)
      .optional()
      .openapi({ description: "Associate name" }),
    email: z
      .string()
      .email()
      .optional()
      .openapi({ description: "Associate email" }),
    phone: z
      .string()
      .min(10)
      .max(15)
      .optional()
      .openapi({ description: "Associate phone" }),
  }),
});

export async function updateAssociateController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const {
      params: { id },
      body: { fullName, email, phone },
    } = updateAssociateSchema.parse(request);

    if (fullName === undefined && email === undefined && phone === undefined) {
      throw new Error("At least one field must be provided for update");
    }

    const updateAssociateUseCase = container.resolve<UpdateAssociateUseCase>(
      "updateAssociateUseCase"
    );

    await updateAssociateUseCase.execute({ id, fullName, email, phone });

    return response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
