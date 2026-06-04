import { UniqueEntityId } from "../domain/UniqueEntityId.js";

/**
 * AggregateSnapshot — Estado serializado de um aggregate em um ponto no tempo.
 *
 * Um snapshot é tirado a cada N eventos para evitar replay completo desde o
 * início. Na reconstituição, carregamos o último snapshot e apenas os eventos
 * POSTERIORES a ele — em vez de todos os eventos da história do aggregate.
 *
 * QUANDO TIRAR SNAPSHOT:
 *   A política padrão é a cada 100 eventos (SNAPSHOT_THRESHOLD).
 *   Aggregates que mudam muito (ex: ComponentAggregate em projetos grandes)
 *   se beneficiam mais. Aggregates estáveis (ProfileAggregate) raramente
 *   precisam de snapshot.
 *
 * CONTEÚDO:
 *   state     → serialização completa do aggregate no momento do snapshot
 *   version   → sequenceNumber do último evento incluído no snapshot
 *               (usado em loadEventsSince para carregar apenas o delta)
 */
export interface AggregateSnapshot {
    readonly id: string;
    readonly aggregateId: UniqueEntityId<any>;
    readonly aggregateType: string;
    readonly state: string; // JSON do estado completo
    readonly version: number; // sequenceNumber do último evento aplicado
    readonly takenAt: Date;
}

/**
 * ISnapshotStore — Armazenamento de snapshots para Event Sourced Aggregates.
 *
 * FLUXO DE RECONSTITUIÇÃO COM SNAPSHOT:
 *
 *   1. snapshotStore.findLatest(aggregateId)
 *      → Some(snapshot) com state na versão N
 *      → None se nunca houve snapshot
 *
 *   2. Se snapshot existe:
 *      eventStore.loadEventsSince(aggregateId, snapshot.version)
 *      → apenas eventos após versão N
 *
 *   3. Se não existe:
 *      eventStore.loadEvents(aggregateId)
 *      → todos os eventos (replay completo)
 *
 *   4. aggregate.reconstitute(snapshot?.state)
 *      aggregate.applyEvents(deltaEvents)
 *
 * POLÍTICA DE SNAPSHOT:
 *   O EventSourcedAggregate decide quando tirar snapshot baseado em
 *   SNAPSHOT_THRESHOLD. O ISnapshotStore apenas persiste e recupera.
 */
export interface ISnapshotStore {
    /**
     * Busca o snapshot mais recente de um aggregate.
     * Retorna null se nunca houve snapshot.
     */
    findLatest(
        aggregateId: UniqueEntityId<any>,
    ): Promise<AggregateSnapshot | null>;

    /**
     * Persiste um novo snapshot, substituindo o anterior se existir.
     */
    save(snapshot: Omit<AggregateSnapshot, "id" | "takenAt">): Promise<void>;

    /**
     * Remove snapshots antigos de um aggregate, mantendo apenas o mais recente.
     * Chamado após tirar novo snapshot para liberar espaço.
     */
    deleteOlderThan(
        aggregateId: UniqueEntityId<any>,
        keepLatest: number,
    ): Promise<void>;
}
