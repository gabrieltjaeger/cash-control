import { deletePaymentController } from "@infra/http/controllers/payments/delete-payment";
import { listPaymentsController } from "@infra/http/controllers/payments/list-payments";
import { registerPaymentController } from "@infra/http/controllers/payments/register-payment";

import { Router } from "express";

export const paymentsRouter = Router();

paymentsRouter.get("/", listPaymentsController);
paymentsRouter.post("/", registerPaymentController);
paymentsRouter.delete("/:id", deletePaymentController);
