import { listMensalitiesController } from "@infra/http/controllers/mensalities/list-mensalities";
import { registerMensalityController } from "@infra/http/controllers/mensalities/register-mensality";
import { updateMensalityController } from "@infra/http/controllers/mensalities/update-mensality";

import { Router } from "express";

export const mensalitiesRouter = Router();

mensalitiesRouter.get("/", listMensalitiesController);
mensalitiesRouter.post("/", registerMensalityController);
mensalitiesRouter.patch("/:id", updateMensalityController);
