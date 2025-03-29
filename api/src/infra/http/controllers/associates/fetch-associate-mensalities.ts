import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { FetchAssociateMensalitiesUseCase } from "@core/use-cases/associates/fetch-associate-mensalities";
import { MensalityPresenter } from "@infra/http/presenters/mensality-presenter";

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
    const { id } = fetchAssociateMensalitiesSchema.params.parse(request.params);
    const { year } = fetchAssociateMensalitiesSchema.query.parse(request.query);

    const fetchAssociateMensalitiesUseCase =
      container.resolve<FetchAssociateMensalitiesUseCase>(
        "fetchAssociateMensalitiesUseCase"
      );

    const mensalities = await fetchAssociateMensalitiesUseCase.execute({
      id,
      year,
    });

    return response
      .status(200)
      .send(
        mensalities.map((mensality) => MensalityPresenter.toDTO(mensality!))
      );
  } catch (error) {
    next(error);
  }
}
