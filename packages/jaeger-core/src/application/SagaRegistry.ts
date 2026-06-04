import type { AppError, Result } from "@jaeger/shared-contracts";
import type { IntegrationEventLike } from "./BaseEventHandler.js";
import type { BaseSaga } from "./BaseSaga.js";

/**
 * SagaRegistry — Mapa de tipo de evento para Saga(s) registradas.
 *
 * PROBLEMA QUE RESOLVE:
 *   O IntegrationEventBus despacha um evento para múltiplos handlers.
 *   Quando múltiplas Sagas precisam reagir ao mesmo evento (raro, mas possível),
 *   o SagaRegistry permite registrar e disparar todas elas de uma vez,
 *   mantendo o ponto de registro centralizado no Composition Root.
 *
 * DIFERENÇA PARA EVENTO → HANDLER SIMPLES:
 *   Um EventHandler executa uma ação atômica e retorna.
 *   Uma Saga executa uma sequência multi-step com compensação.
 *   O SagaRegistry é o "despachador" que sabe qual Saga usar para cada evento.
 *
 * REGISTRO (em apps/backend/src/main/composition/wireEventBus.ts):
 *
 *   const sagaRegistry = new SagaRegistry();
 *   sagaRegistry.register(
 *     "ProfileCreatedIntegrationEvent",
 *     new NewProfileOnboardingSaga(commandBus),
 *   );
 *
 *   // No bus:
 *   bus.subscribe("ProfileCreatedIntegrationEvent", sagaRegistry);
 *
 * SagaRegistry implementa a interface do bus diretamente, delegando
 * para todas as sagas registradas para aquele eventName.
 */
export class SagaRegistry {
    private readonly sagas = new Map<
        string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        BaseSaga<any>[]
    >();

    /**
     * Registra uma Saga para um tipo de Integration Event.
     *
     * @param eventName  Nome do evento (ex: "ProfileCreatedIntegrationEvent")
     * @param saga       Instância da saga a executar
     */
    public register(
        eventName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        saga: BaseSaga<any>,
    ): void {
        const existing = this.sagas.get(eventName) ?? [];
        existing.push(saga);
        this.sagas.set(eventName, existing);
    }

    /**
     * Despacha o evento para todas as Sagas registradas para aquele eventName.
     * Executa em paralelo; erros de uma saga não bloqueiam as demais.
     *
     * Retorna array de resultados — um por saga registrada.
     */
    public async handle(
        event: IntegrationEventLike,
    ): Promise<Result<void, AppError[]>[]> {
        const sagas = this.sagas.get(event.eventName) ?? [];
        return Promise.all(sagas.map((saga) => saga.handle(event)));
    }

    /**
     * Retorna true se há pelo menos uma saga registrada para o eventName.
     */
    public hasSagasFor(eventName: string): boolean {
        return (this.sagas.get(eventName)?.length ?? 0) > 0;
    }
}
