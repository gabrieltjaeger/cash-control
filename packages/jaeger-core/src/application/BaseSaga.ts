import {
    Err,
    OkVoid,
    type AppError,
    type Result,
} from "@jaeger/shared-contracts";
import {
    BaseEventHandler,
    type IntegrationEventLike,
} from "./BaseEventHandler.js";

/**
 * SagaStep — Unidade atômica e compensável de uma Saga.
 *
 * CONTRATO:
 *   - execute()   → aplica a mutação via CommandBus. Idempotente.
 *   - compensate() → reverte a mutação. Best-effort. Nunca lança.
 *
 * EXEMPLO:
 *
 *   const step: SagaStep = {
 *     name: "CreatePersonalTeam",
 *     execute: async () => {
 *       const result = await commandBus.execute(
 *         new CreateTeamCommand({ idempotencyKey: `${sagaId}:team`, ownerId })
 *       );
 *       if (result.ok) teamId = result.value.teamId;
 *       return result.ok ? OkVoid : result;
 *     },
 *     compensate: async () => {
 *       if (teamId) {
 *         await commandBus.execute(
 *           new ArchiveTeamCommand({ idempotencyKey: `${sagaId}:team:rollback`, teamId })
 *         );
 *       }
 *     },
 *   };
 */
export interface SagaStep {
    readonly name: string;
    execute(): Promise<Result<void, AppError[]>>;
    compensate(): Promise<void>;
}

/**
 * SagaExecutionContext — Metadados injetados em cada Saga para rastreabilidade.
 */
export interface SagaExecutionContext {
    /** ID único desta execução. Usado como prefixo de idempotencyKey nos steps. */
    readonly sagaId: string;
    /** ID do evento que disparou a saga. Para correlação em logs. */
    readonly correlationEventId: string;
}

/**
 * BaseSaga — Orquestração de múltiplos passos com compensação transacional.
 *
 * MODELO MENTAL:
 *   Uma Saga é uma transação distribuída implementada como sequência de
 *   comandos locais, onde cada passo bem-sucedido publica um evento, e
 *   uma falha dispara rollback dos passos já executados em ordem inversa
 *   (padrão LIFO — Last In, First Out).
 *
 * QUANDO USAR:
 *   - Fluxo de negócio que muta múltiplos Aggregates em módulos diferentes
 *   - Cada passo é reversível semanticamente (não apenas tecnicamente)
 *
 * REGRAS IMPOSTAS PELO MOTOR:
 *   - SagaCannotDirectlyMutateAggregateRule: steps NUNCA tocam Aggregates
 *     diretamente — apenas despachando Commands via CommandBus
 *   - SagaMustHaveCompensationForEveryStepRule: defineSteps() deve retornar
 *     compensate() para cada step que produz efeito colateral
 *   - SagaStepsMustBeIdempotentRule: execute() deve usar idempotencyKey
 *     derivado do sagaId para garantir que retries não criam duplicatas
 *
 * EXEMPLO COMPLETO (NewProfileOnboardingSaga):
 *
 *   export class NewProfileOnboardingSaga
 *     extends BaseSaga<ProfileCreatedIntegrationEvent>
 *   {
 *     constructor(private readonly commandBus: ICommandBus) { super(); }
 *
 *     protected defineSteps(
 *       event: ProfileCreatedIntegrationEvent,
 *       ctx: SagaExecutionContext,
 *     ): SagaStep[] {
 *       let tokenId: string | undefined;
 *       let teamId: string | undefined;
 *
 *       return [
 *         {
 *           name: "IssueDefaultAuthToken",
 *           execute: async () => {
 *             const result = await this.commandBus.execute(
 *               new IssueAuthTokenCommand({
 *                 idempotencyKey: `${ctx.sagaId}:token`,
 *                 profileId: event.payload.profileId,
 *                 scope: "daemon",
 *               })
 *             );
 *             if (result.ok) tokenId = result.value.tokenId;
 *             return result.ok ? OkVoid : result;
 *           },
 *           compensate: async () => {
 *             if (tokenId) {
 *               await this.commandBus.execute(
 *                 new RevokeAuthTokenCommand({
 *                   idempotencyKey: `${ctx.sagaId}:token:rollback`,
 *                   tokenId,
 *                 })
 *               );
 *             }
 *           },
 *         },
 *         {
 *           name: "CreatePersonalTeam",
 *           execute: async () => { ... },
 *           compensate: async () => { ... },
 *         },
 *       ];
 *     }
 *   }
 */
export abstract class BaseSaga<
    TEvent extends IntegrationEventLike,
> extends BaseEventHandler<TEvent> {
    protected async handleEvent(
        event: TEvent,
    ): Promise<Result<void, AppError[]>> {
        const ctx: SagaExecutionContext = {
            sagaId: `${this.constructor.name}:${event.eventId}`,
            correlationEventId: event.eventId,
        };

        const steps = this.defineSteps(event, ctx);
        const completed: SagaStep[] = [];

        for (const step of steps) {
            try {
                const result = await step.execute();
                if (!result.ok) {
                    await this.runCompensations(completed, ctx);
                    return result;
                }
                completed.push(step);
            } catch (err) {
                await this.runCompensations(completed, ctx);
                if (err instanceof Error) {
                    return Err([this.wrapUnknownError(err, event)]);
                }
                throw err;
            }
        }

        return OkVoid;
    }

    /**
     * Subclasses definem os steps ordenados da saga.
     *
     * @param event  O Integration Event que disparou a saga
     * @param ctx    Contexto com sagaId (usar como prefixo de idempotencyKey)
     */
    protected abstract defineSteps(
        event: TEvent,
        ctx: SagaExecutionContext,
    ): SagaStep[];

    /**
     * Executa compensações em ordem inversa (LIFO).
     * Falhas em compensações individuais não interrompem o ciclo —
     * "best-effort rollback" é o padrão para sagas.
     */
    private async runCompensations(
        completed: SagaStep[],
        ctx: SagaExecutionContext,
    ): Promise<void> {
        for (let i = completed.length - 1; i >= 0; i--) {
            const step = completed[i]!;
            try {
                await step.compensate();
            } catch (err) {
                this.onCompensationFailure(step, err as Error, ctx);
            }
        }
    }

    /**
     * Hook para subclasses logarem falhas de compensação.
     * Em produção: emitir evento de alerta para observabilidade.
     */
    protected onCompensationFailure(
        _step: SagaStep,
        _error: Error,
        _ctx: SagaExecutionContext,
    ): void {}
}
