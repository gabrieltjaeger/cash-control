import { registerPaymentController } from "@infra/http/controllers/payments/register-payment";

import { Router } from "express";

export const paymentsRouter = Router();

paymentsRouter.post("/", registerPaymentController);
