import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { FetchAssociateMensalitiesUseCase } from "@core/use-cases/fetch-associate-mensalities";

import { AssociatePresenter } from "@infra/http/presenters/associate-presenter";

export const fetchAssociateMensalitiesSchema = {
  params: z.object({
    id: z.string().cuid2().openapi({ description: "Associate ID" }),
  }),
  query: z.object({
    year: z.coerce.number().int().positive().openapi({
      description: "Year to fetch mensalities",
      example: 2025,
    }),
  }),
};

export async function fetchAssociateMensalitiesController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    console.log("fetchAssociateMensalitiesController");
    const { id } = fetchAssociateMensalitiesSchema.params.parse(request.params);
    const { year } = fetchAssociateMensalitiesSchema.query.parse(request.query);

    const fetchAssociateMensalitiesUseCase =
      container.resolve<FetchAssociateMensalitiesUseCase>(
        "fetchAssociateMensalitiesUseCase"
      );

    const { associate } = await fetchAssociateMensalitiesUseCase.execute({
      id,
      year,
    });

    return response
      .status(200)
      .send(AssociatePresenter.toDTO(associate, ["payments"]));
  } catch (error) {
    next(error);
  }
}
