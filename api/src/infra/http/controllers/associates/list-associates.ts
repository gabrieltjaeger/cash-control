import container from "@infra/container";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import "zod-openapi/extend";

import { ListAssociatesUseCase } from "@core/use-cases/associates/list-associates";

import { AssociatePresenter } from "@infra/http/presenters/associate-presenter";

export const listAssociatesSchema = {
  query: z.object({
    name: z.string().optional().openapi({ description: "Associate name" }),
    page: z.coerce.number().int().positive().default(1).openapi({
      description: "Page number",
    }),
    perPage: z.coerce.number().int().positive().default(10).optional().openapi({
      description: "Associates per page",
    }),
  }),
};

export async function listAssociatesController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { name, page, perPage } = listAssociatesSchema.query.parse(
      request.query
    );

    console.log({ name, page, perPage });

    const listAssociatesUseCase = container.resolve<ListAssociatesUseCase>(
      "listAssociatesUseCase"
    );

    const { associates } = await listAssociatesUseCase.execute({
      name,
      page: page,
      take: perPage,
    });

    console.log(associates);

    return response
      .status(200)
      .send(associates.map((associate) => AssociatePresenter.toDTO(associate)));
  } catch (error) {
    next(error);
  }
}
