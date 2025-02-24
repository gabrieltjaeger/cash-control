import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { FetchAssociateUseCase } from "@core/use-cases/fetch-associate";

import { AssociatePresenter } from "@infra/http/presenters/associate-presenter";

export const fetchAssociateSchema = z.object({
  params: z.object({
    id: z.string().cuid2().openapi({ description: "Associate ID" }),
  }),
});

export async function fetchAssociateController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const {
      params: { id },
    } = fetchAssociateSchema.parse(request);

    const fetchAssociateUseCase = container.resolve<FetchAssociateUseCase>(
      "fetchAssociateUseCase"
    );

    const { associate } = await fetchAssociateUseCase.execute({ id });

    return response.status(200).send(AssociatePresenter.toDTO(associate));
  } catch (error) {
    next(error);
  }
}
