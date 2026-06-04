import type { AppError, Result } from "@jaeger/shared-contracts";
import type { IQuery } from "../application/CommandQueryMarkers.js";

/**
 * IQueryBus — Despachador central de Queries (leituras).
 *
 * Mais simples que o CommandBus porque Queries não precisam de:
 *   - Transação (leituras não mutam)
 *   - Idempotência (leituras são naturalmente idempotentes)
 *   - Outbox (leituras não emitem eventos)
 *
 * RESPONSABILIDADES:
 *   1. Resolução de handler pelo tipo do Query
 *   2. Tratamento de exceções não-Result (envolve em InfrastructureError)
 *   3. (Futuramente) cache de leitura, observabilidade
 *
 * Por convenção, o método se chama `ask` (não `execute`) para enfatizar
 * a natureza não-mutativa.
 */
export interface IQueryBus {
    /**
     * Despacha um Query para seu handler registrado.
     */
    ask<TQuery extends IQuery, TResult>(
        query: TQuery,
    ): Promise<Result<TResult, AppError[]>>;
}
