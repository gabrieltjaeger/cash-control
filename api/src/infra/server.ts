import cors from "cors";
import express from "express";

import swaggerUi from "swagger-ui-express";

import dotenv from "dotenv";

import { docs } from "@infra/docs/swagger";
import { handler } from "@infra/http/errors/handler";
import { router } from "@infra/http/routes";

import "zod-openapi/extend";

const app = express();
app.use(cors());
app.use(handler);
app.use(express.json());
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));
dotenv.config();

app.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});
