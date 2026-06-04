import cors from "cors";
import express from "express";

import swaggerUi from "swagger-ui-express";

import dotenv from "dotenv";

import { docs } from "@infra/docs/swagger";
import { handler } from "@infra/http/errors/handler";
import { router } from "@infra/http/routes";

import { Logger } from "@core/ports/logger";
import { applyBigIntSerializer } from "@shared/utils/bigint-serializer";
import "zod-openapi/extend";
import container from "./container";

applyBigIntSerializer();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(handler);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));
dotenv.config();

const logger = container.resolve<Logger>("logger");

app.listen(process.env.API_PORT, () => {
  logger.info(`Server running on port ${process.env.API_PORT}`);
});
