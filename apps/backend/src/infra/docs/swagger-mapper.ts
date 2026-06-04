import { ZodTypeAny } from "zod";
import "zod-openapi/extend";
interface Schema {
  route?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
  params?: ZodTypeAny;
}

export class SwaggerMapper {
  static toDocs({ body, query, route, params }: Schema) {
    const docs = {};

    if (params)
      Object.assign(docs, {
        requestParams: {
          path: params,
        },
      });

    if (body) Object.assign(docs, SwaggerMapper.parseBody(body));

    if (route) Object.assign(docs, { requestParams: { path: route } });

    if (query) Object.assign(docs, { requestParams: { query } });

    return docs;
  }

  private static parseBody(body: ZodTypeAny) {
    return {
      requestBody: {
        content: {
          "application/json": { schema: body },
        },
      },
    };
  }
}
