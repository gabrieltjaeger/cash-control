import { listMensalitiesController } from "@infra/http/controllers/mensalities/list-mensalities";
import { registerMensalityController } from "@infra/http/controllers/mensalities/register-mensality";

import { Router } from "express";

export const mensalitiesRouter = Router();

mensalitiesRouter.get("/", listMensalitiesController);
mensalitiesRouter.post("/", registerMensalityController);
