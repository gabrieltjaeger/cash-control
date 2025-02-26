import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { ListMensalitiesUseCase } from "@core/use-cases/list-mensalities";

import { MensalityPresenter } from "@infra/http/presenters/mensality-presenter";

export const listMensalitiesSchema = {
  query: z.object({
    year: z.coerce.number().int().positive().openapi({
      description: "Year",
    }),
  }),
};

export async function listMensalitiesController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { year } = listMensalitiesSchema.query.parse(request.query);

    const listMensalitiesUseCase = container.resolve<ListMensalitiesUseCase>(
      "listMensalitiesUseCase"
    );

    const { mensalities } = await listMensalitiesUseCase.execute({
      year,
    });

    return response
      .status(200)
      .send(
        mensalities.map((mensality) => MensalityPresenter.toDTO(mensality))
      );
  } catch (error) {
    next(error);
  }
}
