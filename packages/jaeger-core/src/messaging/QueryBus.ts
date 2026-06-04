import { Err, type AppError, type Result } from "@jaeger/shared-contracts";
import type { IQuery } from "../application/CommandQueryMarkers.js";
import { InfrastructureError } from "../errors/InfrastructureError.js";
import type { IHandlerResolver } from "./IHandlerResolver.js";
import type { IQueryBus } from "./IQueryBus.js";

/**
 * QueryBus — Implementação concreta do despachador de Queries.
 *
 * Mais simples que o CommandBus:
 *   1. Resolve handler pelo tipo do Query
 *   2. Invoca handler.execute(query)
 *   3. Captura exceções não-Result, envolvendo em InfrastructureError
 *
 * NÃO há transação, idempotência, ou outbox. Leituras não precisam disso.
 *
 * Handler já retorna Result<T, AppError[]>, então o bus só precisa garantir
 * que exceções inesperadas viram Err corretamente.
 */
export class QueryBus implements IQueryBus {
    constructor(private readonly resolver: IHandlerResolver) {}

    public async ask<TQuery extends IQuery, TResult>(
        query: TQuery,
    ): Promise<Result<TResult, AppError[]>> {
        let handler;
        try {
            handler = this.resolver.resolveQueryHandler<TQuery, TResult>(query);
        } catch (err) {
            return Err([this.toInfraError(err, "query-bus-resolve")]);
        }

        try {
            return await handler.execute(query);
        } catch (err) {
            return Err([this.toInfraError(err, "query-bus-execute")]);
        }
    }

    private toInfraError(err: unknown, subsystem: string): AppError {
        if (err instanceof Error) {
            return new InfrastructureError(subsystem, err.message, {
                cause: err,
                isRetryable: false,
            });
        }
        return new InfrastructureError(
            subsystem,
            "Unknown error during query dispatch",
            { isRetryable: false },
        );
    }
}
