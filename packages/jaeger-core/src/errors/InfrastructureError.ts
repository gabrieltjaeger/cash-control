import { BaseAppError } from "./BaseAppError.js";

/**
 * InfrastructureError — Falha em camada externa ao domínio.
 *
 * REGRA: o domínio NUNCA emite InfrastructureError diretamente. Apenas
 * adapters em /infra podem produzir este tipo. O domínio recebe via
 * Repository/Gateway e decide se propaga ou trata.
 *
 * MAPEAMENTO HTTP: 500 Internal Server Error.
 */
export class InfrastructureError extends BaseAppError {
    /**
     * Subsistema técnico onde ocorreu a falha.
     * Exemplos: 'database', 'filesystem', 'git', 'ast-parser', 'websocket'.
     */
    public readonly subsystem: string;

    /**
     * Indica se a operação pode ser retentada com sucesso provável.
     * Útil para policies de retry automático.
     */
    public readonly isRetryable: boolean;

    constructor(
        subsystem: string,
        message: string,
        options: {
            isRetryable?: boolean;
            cause?: BaseAppError | Error;
            context?: Record<string, unknown>;
        } = {},
    ) {
        super(
            "InfrastructureError",
            `INFRA_${subsystem.toUpperCase()}_ERROR`,
            message,
            { subsystem, ...options.context },
            options.cause,
        );
        this.subsystem = subsystem;
        this.isRetryable = options.isRetryable ?? false;
    }
}
