import { BaseAppError } from "./BaseAppError.js";

/**
 * NotFoundError — Recurso solicitado não existe.
 *
 * MAPEAMENTO HTTP: 404 Not Found.
 */
export class NotFoundError extends BaseAppError {
    public readonly resourceType: string;
    public readonly identifier: string;

    constructor(
        resourceType: string,
        identifier: string,
        context: Record<string, unknown> = {},
    ) {
        super(
            "NotFoundError",
            `${resourceType.toUpperCase()}_NOT_FOUND`,
            `${resourceType} not found: ${identifier}`,
            { resourceType, identifier, ...context },
        );
        this.resourceType = resourceType;
        this.identifier = identifier;
    }
}
