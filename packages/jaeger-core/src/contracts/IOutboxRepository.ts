import { UniqueEntityId } from "../domain/UniqueEntityId.js";

/**
 * OutboxEntry — Registro de um evento de domínio aguardando publicação.
 *
 * O Outbox Pattern garante que eventos de domínio sejam publicados
 * EXATAMENTE UMA VEZ mesmo em caso de falha do processo.
 *
 * CICLO DE VIDA:
 *   PENDING  → evento gravado junto com o aggregate na mesma transação
 *   PROCESSING → worker adquiriu o lock e está publicando
 *   PUBLISHED → publicado com sucesso no bus de Integration Events
 *   DEAD_LETTER → falhou após maxAttempts tentativas
 */
export interface OutboxEntry {
    readonly id: string;
    readonly aggregateId: UniqueEntityId<any>;
    readonly aggregateType: string;
    readonly eventName: string;
    readonly payload: string; // JSON serializado do Integration Event
    readonly status: OutboxEntryStatus;
    readonly attempts: number;
    readonly maxAttempts: number;
    readonly createdAt: Date;
    readonly nextAttemptAt: Date | null;
    readonly processedAt: Date | null;
    readonly failureReason: string | null;
}

export type OutboxEntryStatus =
    | "PENDING"
    | "PROCESSING"
    | "PUBLISHED"
    | "FAILED"
    | "DEAD_LETTER";

/**
 * IOutboxRepository — Contrato de acesso à tabela de outbox.
 *
 * IMPLEMENTAÇÃO CONCRETA: SqliteOutboxRepository em /shared/infra/outbox/
 *
 * PADRÃO DE USO pelo OutboxWorker:
 *   1. findPending(limit)          → busca lote de eventos pendentes
 *   2. markProcessing(ids)         → adquire lock (atualiza status atomicamente)
 *   3. [publica no Redis Stream]
 *   4. markPublished(ids)          → registra sucesso
 *      OU markFailed(id, reason)   → registra falha com razão
 *
 * CRIAÇÃO pelo UnitOfWork (durante save de aggregate):
 *   1. save(aggregate) dentro de transaction
 *   2. commitEvents(aggregate.domainEvents) — escreve na outbox
 *   3. commit() — tudo ou nada
 */
export interface IOutboxRepository {
    /**
     * Busca eventos PENDING ordenados por createdAt ASC.
     * O lock otimista (status = PROCESSING) é aplicado em markProcessing.
     */
    findPending(limit: number): Promise<OutboxEntry[]>;

    /**
     * Busca eventos FAILED com attempts < maxAttempts (candidatos a retry).
     */
    findForRetry(limit: number): Promise<OutboxEntry[]>;

    /**
     * Insere múltiplos eventos em batch (chamado dentro da transação do UoW).
     */
    insertBatch(
        entries: Omit<OutboxEntry, "id" | "createdAt">[],
    ): Promise<void>;

    /**
     * Atualiza status para PROCESSING. Operação atômica — ignora entradas
     * já em PROCESSING (evita double-processing entre workers).
     * Retorna apenas os IDs efetivamente adquiridos.
     */
    markProcessing(ids: string[]): Promise<string[]>;

    /**
     * Marca como PUBLISHED e grava processedAt.
     */
    markPublished(ids: string[]): Promise<void>;

    /**
     * Incrementa attempts e muda status para FAILED se atingiu maxAttempts,
     * ou de volta para PENDING se ainda há tentativas restantes.
     */
    markFailed(id: string, reason: string): Promise<void>;

    /**
     * Remove entradas PUBLISHED com mais de retentionDays dias.
     * Chamado por background job periódico.
     */
    deletePublished(olderThanDays: number): Promise<number>;
}
