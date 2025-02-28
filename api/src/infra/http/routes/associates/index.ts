import { fetchAssociateController } from "@infra/http/controllers/associates/fetch-associate";
import { fetchAssociateMensalitiesController } from "@infra/http/controllers/associates/fetch-associate-mensalities";
import { listAssociatesController } from "@infra/http/controllers/associates/list-associates";
import { registerAssociateController } from "@infra/http/controllers/associates/register-associate";

import { Router } from "express";

export const associatesRouter = Router();

associatesRouter.get("/", listAssociatesController);
associatesRouter.post("/", registerAssociateController);
associatesRouter.get("/:id", fetchAssociateController);
associatesRouter.get("/:id/mensalities", fetchAssociateMensalitiesController);
