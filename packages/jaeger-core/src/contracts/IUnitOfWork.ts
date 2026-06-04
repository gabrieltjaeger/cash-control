import type { AggregateRoot } from "../domain/AggregateRoot.js";
import type { DomainEvent } from "../domain/DomainEvent.js";

/**
 * IUnitOfWork — Coordenação transacional de persistência e eventos.
 *
 * NOVA RESPONSABILIDADE (após introdução do CommandBus):
 *   O Use Case retorna aggregates mutados (já com Domain Events anexados).
 *   O CommandBus orquestra a persistência chamando este UoW em sequência:
 *     1. uow.save(aggregate) → persiste o aggregate via repositório apropriado
 *     2. uow.commitEvents(events) → escreve eventos na outbox
 *     3. uow.commit() → COMMIT da transação SQL
 *
 * Toda essa sequência roda numa única transação ACID. Se qualquer passo
 * falhar, rollback automático.
 *
 * REGRA FUNDAMENTAL: o domínio NUNCA conhece o tipo concreto da transação.
 * O Use Case não recebe ITransactionContext — apenas o CommandBus o vê.
 *
 * IMPLEMENTAÇÃO (em /shared/infra/database):
 *   - SqliteUnitOfWork resolve o repositório certo via tipo do aggregate
 *     (registro estático: Map<AggregateClass, Repository>).
 *   - commitEvents serializa Domain Events em registros de outbox.
 *
 * Padrão de uso pelo CommandBus:
 *
 *   await uow.begin();
 *   try {
 *     for (const ag of outcome.aggregates) await uow.save(ag);
 *     const allEvents = outcome.aggregates.flatMap(ag => ag.domainEvents);
 *     await uow.commitEvents(allEvents);
 *     await uow.commit();
 *     outcome.aggregates.forEach(ag => ag.clearDomainEvents());
 *   } catch (err) {
 *     await uow.rollback();
 *     throw err;
 *   }
 */
export interface IUnitOfWork {
    /**
     * Executa uma unidade de trabalho inteira dentro de uma única transação.
     * Implementações devem garantir que leituras, idempotência, writes e outbox
     * usem a mesma conexão transacional.
     */
    runInTransaction<T>(work: () => Promise<T>): Promise<T>;

    /**
     * Inicia uma nova transação. Falha se já há uma transação em andamento
     * nesta instância (UoW é stateful por design — uma instância por request).
     */
    begin(): Promise<void>;

    /**
     * Persiste um Aggregate Root. Resolve o repositório correto pelo tipo
     * do aggregate. Aplica OCC: rejeita se version do banco diverge.
     *
     * Aceita múltiplas chamadas — todas operam na mesma transação aberta.
     */
    save(aggregate: AggregateRoot): Promise<void>;

    /**
     * Grava Domain Events na tabela outbox. Os eventos serão despachados
     * como Integration Events pelo OutboxWorker em ciclo separado.
     *
     * IMPORTANTE: o aggregate deve ainda conter seus eventos quando chamado.
     * O CommandBus invoca `aggregate.clearDomainEvents()` APENAS após
     * commit() bem-sucedido.
     */
    commitEvents(events: ReadonlyArray<DomainEvent>): Promise<void>;

    /**
     * COMMIT da transação. Após este ponto, mudanças são duráveis.
     */
    commit(): Promise<void>;

    /**
     * ROLLBACK da transação. Limpa todas as mudanças pendentes.
     */
    rollback(): Promise<void>;
}
