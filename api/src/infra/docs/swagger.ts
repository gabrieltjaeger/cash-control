import { createDocument } from "zod-openapi";

import { fetchAssociateSchema } from "@infra/http/controllers/fetch-associate";
import { listAssociatesSchema } from "@infra/http/controllers/list-associates";
import { registerAssociateSchema } from "@infra/http/controllers/register-associate";
import { SwaggerMapper } from "./swagger-mapper";

const tags = {
  associates: "Associates",
  payments: "Payments",
  mensalities: "Mensalities",
};

const docs = createDocument({
  openapi: "3.0.0",
  info: {
    title: "Cash Control API",
    version: "1.0.0",
    description: "API documentation for Cash Control",
  },
  tags: Object.values(tags).map((name) => ({ name })),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/associates": {
      get: {
        tags: [tags.associates],
        summary: "List associates",
        description: "List all associates",
        responses: {
          200: {
            description: "Associates listed successfully",
          },
          400: {
            description: "Bad request",
          },
        },
        ...SwaggerMapper.toDocs(listAssociatesSchema),
      },
      post: {
        tags: [tags.associates],
        summary: "Register an associate",
        description: "Register a new associate",
        responses: {
          201: {
            description: "Associate registered successfully",
          },
          400: {
            description: "Bad request",
          },
        },
        ...SwaggerMapper.toDocs(registerAssociateSchema),
      },
    },
    "/associates/{id}": {
      get: {
        tags: [tags.associates],
        summary: "Fetch an associate",
        description: "Fetch an associate by its ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "string",
              format: "cuid2",
            },
          },
        ],
        responses: {
          200: {
            description: "Associate fetched successfully",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "Associate not found",
          },
        },
        ...SwaggerMapper.toDocs(fetchAssociateSchema as any),
      },
    },
  },
});

export { docs };
