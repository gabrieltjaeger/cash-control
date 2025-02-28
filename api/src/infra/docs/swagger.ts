import { createDocument } from "zod-openapi";

import { fetchAssociateSchema } from "@infra/http/controllers/associates/fetch-associate";
import { fetchAssociateMensalitiesSchema } from "@infra/http/controllers/associates/fetch-associate-mensalities";
import { listAssociatesSchema } from "@infra/http/controllers/associates/list-associates";
import { registerAssociateSchema } from "@infra/http/controllers/associates/register-associate";
import { listMensalitiesSchema } from "@infra/http/controllers/mensalities/list-mensalities";
import { registerMensalitySchema } from "@infra/http/controllers/mensalities/register-mensality";
import { registerPaymentSchema } from "@infra/http/controllers/payments/register-payment";

import { SwaggerMapper } from "@infra/docs/swagger-mapper";

const tags = {
  associates: "Associates",
  mensalities: "Mensalities",
  payments: "Payments",
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
    "/associates/{id}/mensalities": {
      get: {
        tags: [tags.associates],
        summary: "Fetch associate mensalities",
        description: "Fetch all mensalities of an associate in a year",
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
            description: "Associate mensalities fetched successfully",
          },
          400: {
            description: "Bad request",
          },
          404: {
            description: "Associate not found",
          },
        },
        ...SwaggerMapper.toDocs(fetchAssociateMensalitiesSchema as any),
      },
    },
    "/mensalities": {
      get: {
        tags: [tags.mensalities],
        summary: "List mensalities",
        description: "List all mensalities in a year",
        responses: {
          200: {
            description: "Mensalities listed successfully",
          },
          400: {
            description: "Bad request",
          },
        },
        ...SwaggerMapper.toDocs(listMensalitiesSchema),
      },
      post: {
        tags: [tags.mensalities],
        summary: "Register a mensality",
        description: "Register a new mensality",
        responses: {
          201: {
            description: "Mensality registered successfully",
          },
          400: {
            description: "Bad request",
          },
        },
        ...SwaggerMapper.toDocs(registerMensalitySchema),
      },
    },
    "/payments": {
      post: {
        tags: [tags.payments],
        summary: "Register a payment",
        description: "Register a new payment",
        responses: {
          201: {
            description: "Payment registered successfully",
          },
          400: {
            description: "Bad request",
          },
        },
        ...SwaggerMapper.toDocs(registerPaymentSchema),
      },
    },
  },
});

export { docs };
