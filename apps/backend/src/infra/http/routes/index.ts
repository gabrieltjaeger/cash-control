import { associatesRouter } from "@infra/http/routes/associates";
import { mensalitiesRouter } from "@infra/http/routes/mensalities";
import { paymentsRouter } from "@infra/http/routes/payments";
import { Router } from "express";

export const router = Router();

router.use("/payments", paymentsRouter);
router.use("/mensalities", mensalitiesRouter);
router.use("/associates", associatesRouter);
