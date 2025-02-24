import { fetchAssociateController } from "@infra/http/controllers/fetch-associate";
import { listAssociatesController } from "@infra/http/controllers/list-associates";
import { registerAssociateController } from "@infra/http/controllers/register-associate";
import { Router } from "express";

export const router = Router();

router.get("/associates", listAssociatesController);
router.post("/associates", registerAssociateController);
router.get("/associates/:id", fetchAssociateController);
