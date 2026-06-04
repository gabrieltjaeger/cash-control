import { BaseAppError } from "./BaseAppError.js";

/**
 * ConcurrencyError — Optimistic Concurrency Control falhou.
 *
 * Emitido quando uma operação de save em um Aggregate Root encontra
 * `version` no banco diferente da version esperada.
 *
 * MAPEAMENTO HTTP: 409 Conflict (com header sugerindo retry).
 */
export class ConcurrencyError extends BaseAppError {
    public readonly resourceType: string;
    public readonly resourceId: string;
    public readonly expectedVersion: number;
    public readonly actualVersion?: number;

    constructor(
        resourceType: string,
        resourceId: string,
        expectedVersion: number,
        actualVersion?: number,
    ) {
        super(
            "ConcurrencyError",
            "CONCURRENCY_CONFLICT",
            `Concurrent modification detected on ${resourceType} ${resourceId}. ` +
                `Expected version ${expectedVersion}` +
                (actualVersion !== undefined
                    ? `, found ${actualVersion}.`
                    : "."),
            {
                resourceType,
                resourceId,
                expectedVersion,
                actualVersion,
            },
        );
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.expectedVersion = expectedVersion;
        this.actualVersion = actualVersion;
    }
}
