import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { RegisterAssociateUseCase } from "@core/use-cases/register-associate";

export const registerAssociateSchema = {
  body: z.object({
    fullName: z
      .string()
      .min(3)
      .max(255)
      .openapi({ description: "Associate name" }),
    email: z.string().email().openapi({ description: "Associate email" }),
    phone: z
      .string()
      .min(10)
      .max(15)
      .openapi({ description: "Associate phone" }),
  }),
};

export async function registerAssociateController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    console.log("registerAssociateController");
    const { fullName, email, phone } = registerAssociateSchema.body.parse(
      request.body
    );

    console.log("registerAssociateController", fullName, email, phone);
    const registerAssociateUseCase =
      container.resolve<RegisterAssociateUseCase>("registerAssociateUseCase");

    await registerAssociateUseCase.execute({ fullName, email, phone });

    return response.status(201).send();
  } catch (error) {
    next(error);
  }
}
