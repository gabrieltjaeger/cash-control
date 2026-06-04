/**
 * ICommand — Marker interface para Commands (mutações).
 *
 * Commands são DTOs imutáveis que representam uma intenção de mutação.
 * Todo Command DEVE ter `idempotencyKey` no payload.
 *
 * Por convenção, classes ou tipos terminam com `Command`:
 *   - CreateProfileCommand
 *   - PromoteComponentCommand
 *   - IgnoreViolationCommand
 *
 * O CommandBus usa o NOME da classe (constructor.name) para resolver
 * o handler correspondente via IHandlerResolver.
 */
export interface ICommand {
    readonly idempotencyKey: string;
}

/**
 * IQuery — Marker interface para Queries (leituras).
 *
 * Queries não têm idempotencyKey porque leituras são naturalmente idempotentes.
 *
 * Por convenção, classes ou tipos terminam com `Query`:
 *   - GetProfileByIdQuery
 *   - ListComponentsByModuleQuery
 *   - GetContextMapQuery
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IQuery {}
