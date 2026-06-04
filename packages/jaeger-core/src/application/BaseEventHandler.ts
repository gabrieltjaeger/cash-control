import {
    Err,
    OkVoid,
    type AppError,
    type Result,
} from "@jaeger/shared-contracts";
import { InfrastructureError } from "../errors/InfrastructureError.js";

/**
 * Forma mínima que um Handler precisa conhecer de um Integration Event.
 *
 * A classe completa reside em `/shared/contracts/events/`.
 * Aqui declaramos apenas o contrato estrutural mínimo para desacoplar
 * o BaseEventHandler de qualquer evento concreto.
 */
export interface IntegrationEventLike {
    readonly eventId: string;
    readonly eventName: string;
    readonly occurredAt: Date;
    readonly aggregateId: string;
}

/**
 * BaseEventHandler — Template Method para Handlers de Integration Events.
 *
 * REGRAS FUNDAMENTAIS:
 *   1. Handlers NÃO contêm lógica de negócio. Apenas extraem payload
 *      do evento e invocam um Use Case via CommandBus.
 *   2. Handlers DEVEM ser idempotentes: o mesmo evento pode chegar duas vezes
 *      (at-least-once delivery do bus). Use `event.eventId` como
 *      `idempotencyKey` no Command despachado — o CommandBus deduplica.
 *   3. Handlers NÃO mutam Aggregates diretamente — apenas via CommandBus.
 *
 * RESULTADO: Result<void, AppError[]>
 *   - OkVoid        → evento processado com sucesso
 *   - Err(errors[]) → falha tratada, bus decide requeue/DLQ
 *   - throw         → falha catastrófica, capturada pelo try/catch e
 *                     convertida em Err([InfrastructureError])
 *
 * USO TÍPICO:
 *
 *   export class OnComponentDeclaredHandler
 *     extends BaseEventHandler<ComponentDeclaredIntegrationEvent>
 *   {
 *     constructor(private readonly commandBus: ICommandBus) {
 *       super();
 *     }
 *
 *     protected async handleEvent(
 *       event: ComponentDeclaredIntegrationEvent,
 *     ): Promise<Result<void, AppError[]>> {
 *
 *       const result = await this.commandBus.execute(
 *         new ValidateComponentCommand({
 *           idempotencyKey: event.eventId,
 *           componentId: event.payload.componentId,
 *         })
 *       );
 *
 *       // Propaga o Result do CommandBus diretamente:
 *       // result.ok === true  → Ok<void>
 *       // result.ok === false → Err<AppError[]>
 *       return result.ok ? OkVoid : result;
 *     }
 *   }
 */
export abstract class BaseEventHandler<TEvent extends IntegrationEventLike> {
    /**
     * Ponto de entrada chamado pelo IntegrationEventBus.
     * NÃO sobrescrever em subclasses — implemente handleEvent.
     *
     * Captura qualquer exceção não tratada dentro de handleEvent e a
     * converte em Err([InfrastructureError]) para que o bus possa
     * decidir requeue ou DLQ sem que o processo quebre.
     */
    public async handle(event: TEvent): Promise<Result<void, AppError[]>> {
        try {
            return await this.handleEvent(event);
        } catch (err) {
            if (err instanceof Error) {
                return Err([this.wrapUnknownError(err, event)]);
            }
            // Re-lança não-Error (ex: string throw) — comportamento
            // intencionalmente estrito para detectar código malescrito.
            throw err;
        }
    }

    /**
     * Subclasses implementam a reação ao evento aqui.
     * Retorne OkVoid em sucesso ou Err(errors) em falha tratada.
     * Não precisa tratar exceções — handle() faz isso.
     */
    protected abstract handleEvent(
        event: TEvent,
    ): Promise<Result<void, AppError[]>>;

    // ─── Helpers de retorno para subclasses ──────────────────────────────────

    /**
     * Retorna sucesso sem valor.
     *
     *   return this.ok();
     */
    protected ok(): Result<void, AppError[]> {
        return OkVoid;
    }

    /**
     * Retorna falha com um único erro.
     *
     *   return this.fail(new NotFoundError("Component", id));
     */
    protected fail(error: AppError): Result<void, AppError[]> {
        return Err([error]);
    }

    /**
     * Retorna falha com múltiplos erros (ex: validação composta).
     *
     *   return this.failMany(errors);
     */
    protected failMany(errors: AppError[]): Result<void, AppError[]> {
        return Err(errors);
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * Converte um Error nativo em InfrastructureError retryable.
     * Sobrescreva para customizar logging ou adicionar contexto.
     */
    protected wrapUnknownError(err: Error, event: TEvent): AppError {
        return new InfrastructureError("event-handler", err.message, {
            isRetryable: true,
            cause: err,
            context: {
                eventId: event.eventId,
                eventName: event.eventName,
                handlerName: this.constructor.name,
            },
        });
    }
}
