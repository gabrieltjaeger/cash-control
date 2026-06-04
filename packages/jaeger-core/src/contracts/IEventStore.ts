import type { DomainEvent } from "../domain/DomainEvent.js";
import { UniqueEntityId } from "../domain/UniqueEntityId.js";

/**
 * StoredEvent — Registro de um Domain Event no Event Store.
 *
 * Diferente do OutboxEntry (que rastreia publicação externa), o StoredEvent
 * é o dado primário do Event Sourcing — é a FONTE DA VERDADE do aggregate.
 */
export interface StoredEvent {
    readonly id: string;
    readonly aggregateId: string;
    readonly aggregateType: string;
    readonly eventName: string;
    readonly payload: string; // JSON serializado
    readonly sequenceNumber: number; // posição dentro do aggregate (1, 2, 3...)
    readonly globalSequence: number; // posição global (para projeções em ordem)
    readonly occurredAt: Date;
}

/**
 * IEventStore — Ledger append-only de Domain Events.
 *
 * PRINCÍPIO FUNDAMENTAL:
 *   Eventos nunca são modificados ou deletados — apenas adicionados.
 *   O estado atual de um aggregate é derivado pela aplicação sequencial
 *   de todos os seus eventos (operação "fold/reduce").
 *
 * DIFERENÇA DO OUTBOX:
 *   - EventStore → fonte da verdade, permanente, por aggregate
 *   - Outbox     → fila de publicação, transitória, para Integration Events
 *
 * IMPLEMENTAÇÕES:
 *   - SqliteEventStore    → para Jaeger Forge local (simples, embarcado)
 *   - PostgresEventStore  → para projetos dos usuários que usam Postgres
 *
 * CONCORRÊNCIA (OCC no Event Store):
 *   `append` recebe `expectedVersion` para detectar writes concorrentes.
 *   Se o aggregate tem versão 5 no store mas o caller esperava 4,
 *   lança ConcurrencyError. Equivalente ao WHERE version = ? do write-state.
 */
export interface IEventStore {
    /**
     * Persiste novos eventos para um aggregate. Atômico.
     *
     * @param aggregateId      ID do aggregate
     * @param aggregateType    Nome do tipo (ex: "ComponentAggregate")
     * @param events           Eventos novos (já com sequenceNumber correto)
     * @param expectedVersion  Versão esperada antes desses eventos.
     *                         0 = aggregate novo (não deve existir)
     *
     * @throws ConcurrencyError se a versão atual diverge de expectedVersion
     */
    append(
        aggregateId: UniqueEntityId<any>,
        aggregateType: string,
        events: DomainEvent[],
        expectedVersion: number,
    ): Promise<void>;

    /**
     * Carrega todos os eventos de um aggregate, do mais antigo ao mais recente.
     * Retorna [] se o aggregate nunca existiu.
     */
    loadEvents(aggregateId: UniqueEntityId<any>): Promise<StoredEvent[]>;

    /**
     * Carrega eventos a partir de uma sequência específica.
     * Usado em conjunto com snapshots: carrega apenas eventos APÓS o snapshot.
     *
     * @param afterSequence  sequenceNumber do último evento no snapshot
     */
    loadEventsSince(
        aggregateId: UniqueEntityId<any>,
        afterSequence: number,
    ): Promise<StoredEvent[]>;

    /**
     * Conta quantos eventos existem para um aggregate.
     * Usado para decidir se deve tirar um snapshot.
     */
    countEvents(aggregateId: UniqueEntityId<any>): Promise<number>;

    /**
     * Carrega eventos de todos os aggregates em ordem globalSequence.
     * Usado por Projection Workers para construir Read Models.
     *
     * @param afterGlobalSequence  Posição global a partir da qual carregar
     * @param limit                Máximo de eventos por chamada
     */
    loadGlobalEvents(
        afterGlobalSequence: number,
        limit: number,
    ): Promise<StoredEvent[]>;
}
