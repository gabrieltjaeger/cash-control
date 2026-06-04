import type { EventSourcedAggregate } from "../domain/EventSourcedAggregate.js";
import { UniqueEntityId } from "../domain/UniqueEntityId.js";

/**
 * IEventSourcedRepository<T> — Repositório para aggregates com Event Sourcing.
 *
 * DIFERENÇA DO IReader/IWriter CLÁSSICO:
 *
 *   IReader (clássico):  findById → lê estado atual do banco relacional
 *   IWriter (clássico):  save → persiste estado atual via UPDATE
 *
 *   IEventSourcedRepository:
 *     load → reconstitui aggregate a partir de eventos + snapshot (se existir)
 *     save → persiste APENAS os uncommittedEvents no Event Store (APPEND)
 *            + tira snapshot se shouldTakeSnapshot()
 *            + escreve na tabela outbox para Integration Events
 *
 * FLUXO DO REPOSITÓRIO:
 *
 *   load(id):
 *     1. snapshotStore.findLatest(id)
 *        → se snapshot: eventStore.loadEventsSince(id, snapshot.version)
 *        → se não: eventStore.loadEvents(id)
 *     2. aggregate.rehydrate(events, snapshotVersion)
 *     3. return aggregate
 *
 *   save(aggregate):
 *     1. eventStore.append(id, type, uncommittedEvents, baseVersion)  [OCC aqui]
 *     2. outboxRepo.insertBatch(toOutboxEntries(uncommittedEvents))
 *     3. if aggregate.shouldTakeSnapshot():
 *        snapshotStore.save(aggregate.toSnapshotPayload())
 *     4. aggregate.clearUncommittedEvents()
 *
 * QUERIES (findByX):
 *   Event Sourcing puro NÃO suporta queries por atributos (ex: findByEmail).
 *   Para isso, usa-se Read Models mantidos por Projection Workers.
 *   O repositório event-sourced expõe apenas load() por ID.
 *
 *   Se precisar de findByEmail, crie um IProfileProjectionReader que
 *   lê da tabela desnormalizada mantida pelo ProjectionWorker.
 */
export interface IEventSourcedRepository<T extends EventSourcedAggregate> {
    /**
     * Reconstitui um aggregate pelo ID.
     * Retorna null se o aggregate nunca existiu (nenhum evento no store).
     */
    load(id: UniqueEntityId<any>): Promise<T | null>;

    /**
     * Persiste uncommittedEvents no Event Store e tira snapshot se necessário.
     * @throws ConcurrencyError se baseVersion diverge da versão atual no store
     */
    save(aggregate: T): Promise<void>;
}
