import { BaseAppError } from "./BaseAppError.js";

/**
 * ConflictError — A operação conflita com o estado atual do recurso.
 *
 * MAPEAMENTO HTTP: 409 Conflict.
 */
export class ConflictError extends BaseAppError {
    public readonly resourceType: string;
    public readonly conflictingIdentifier: string;

    constructor(
        resourceType: string,
        conflictingIdentifier: string,
        message?: string,
        context: Record<string, unknown> = {},
    ) {
        super(
            "ConflictError",
            `${resourceType.toUpperCase()}_CONFLICT`,
            message ?? `${resourceType} conflict for: ${conflictingIdentifier}`,
            { resourceType, conflictingIdentifier, ...context },
        );
        this.resourceType = resourceType;
        this.conflictingIdentifier = conflictingIdentifier;
    }
}
