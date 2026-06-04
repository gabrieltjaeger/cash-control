import { AggregateRoot } from "../domain/AggregateRoot.js";

/**
 * CommandOutcome — Resultado de um Command Use Case.
 *
 * Use Cases retornam esta estrutura em vez de chamar o repositório
 * diretamente. O CommandBus é responsável por persistir os aggregates
 * listados e despachar seus Domain Events.
 *
 * VANTAGENS DESTA ABORDAGEM:
 *   - Use Cases tornam-se função pura: input → outcome (sem I/O de persistência)
 *   - Persistência centralizada no Bus (UoW + outbox uniformes)
 *   - Testes triviais: só verificar o outcome retornado, sem mocks de repo
 *   - Suporte natural a Use Cases que mutam múltiplos Aggregates
 *
 * EXEMPLO:
 *
 *   protected async executeCommand(cmd: CreateProfileCommand): Promise<...> {
 *     const profile = ProfileAggregate.create({ ... });
 *     if (!profile.ok) return profile;
 *     return Ok({
 *       result: { profileId: profile.value.id },
 *       aggregates: [profile.value],
 *     });
 *   }
 *
 *   O CommandBus então:
 *     - uow.save(profile.value)
 *     - uow.commitEvents(profile.value.domainEvents)
 *     - uow.commit()
 *     - profile.value.clearDomainEvents()
 *     - retorna { profileId: ... } ao caller
 */
export interface CommandOutcome<TResult> {
    /**
     * Valor retornado ao caller (frontend ou outro Use Case). Pode ser
     * `void` se o Command não tem retorno significativo, mas tipicamente
     * traz IDs recém-criados para suportar Read-Your-Own-Writes.
     */
    readonly result: TResult;

    /**
     * Aggregates mutados ou criados que devem ser persistidos.
     * Pode ser vazio em casos raros (ex: Use Case que apenas valida
     * sem persistir nada).
     *
     * Ordem importa: aggregates são salvos na ordem do array.
     */
    readonly aggregates: ReadonlyArray<AggregateRoot>;
}

/**
 * Helper para Use Cases sem retorno significativo.
 * Cria um outcome com result: undefined e os aggregates fornecidos.
 */
export function VoidOutcome(
    aggregates: ReadonlyArray<AggregateRoot>,
): CommandOutcome<void> {
    return { result: undefined, aggregates };
}