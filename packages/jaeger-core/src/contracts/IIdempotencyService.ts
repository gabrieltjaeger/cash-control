/**
 * IIdempotencyService — Idempotência durável para Commands.
 *
 * MUDANÇA APÓS CommandBus:
 *   A idempotência deixa de ser responsabilidade do BaseCommandUseCase
 *   e passa a ser orquestrada pelo CommandBus.
 *
 * O Use Case fica focado em lógica de domínio pura. O Bus garante:
 *   1. Antes de executar: check da chave → retornar resultado cacheado se já selado
 *   2. Após executar: seal do resultado para replays futuros
 *
 * Todas as operações deste service rodam dentro da transação corrente
 * via IUnitOfWork (a interface não precisa receber `tx` explícito porque
 * a implementação concreta tem acesso ao client de banco transacional).
 */

import type { AppError } from "@jaeger/shared-contracts";

export interface IIdempotencyService {
    /**
     * Verifica o estado atual de uma idempotency key.
     */
    check(key: string): Promise<IdempotencyCheckResult>;

    /**
     * Marca uma chave como "processing". Reserva o slot de execução.
     * Falha se a chave já está em outro estado.
     */
    markProcessing(key: string): Promise<void>;

    /**
     * Sela uma chave com o resultado da execução (sucesso ou falha).
     * Após selada, futuras chamadas com a mesma chave retornam este resultado.
     */
    seal(key: string, payload: SealedPayload): Promise<void>;

    /**
     * Limpa entradas expiradas. Tipicamente invocado por um background job.
     * @returns número de entradas removidas
     */
    cleanupExpired(beforeDate: Date): Promise<number>;
}

/**
 * Estado de uma idempotency key.
 */
export type IdempotencyCheckResult =
    | { status: "new" }
    | { status: "processing"; startedAt: Date }
    | { status: "sealed"; payload: SealedPayload; sealedAt: Date };

/**
 * Forma do payload armazenado ao selar um resultado.
 * Discriminated union para permitir caching de sucessos e falhas.
 */
export type SealedPayload =
    | { kind: "success"; value: unknown }
    | { kind: "failure"; errors: ReadonlyArray<AppError> };
