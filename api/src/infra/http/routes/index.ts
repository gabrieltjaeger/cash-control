import { fetchAssociateController } from "@infra/http/controllers/fetch-associate";
import { listAssociatesController } from "@infra/http/controllers/list-associates";
import { listMensalitiesController } from "@infra/http/controllers/list-mensalities";
import { registerAssociateController } from "@infra/http/controllers/register-associate";
import { registerMensalityController } from "@infra/http/controllers/register-mensality";
import { registerPaymentController } from "@infra/http/controllers/register-payment";
import { Router } from "express";

export const router = Router();

router.get("/associates", listAssociatesController);
router.post("/associates", registerAssociateController);
router.get("/associates/:id", fetchAssociateController);

router.get("/mensalities", listMensalitiesController);
router.post("/mensalities", registerMensalityController);

router.post("/payments", registerPaymentController);
