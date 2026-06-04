/**
 * IEventTransport — Canal de publicação de Integration Events.
 *
 * Abstrai o mecanismo de transporte (Redis Streams, RabbitMQ, in-memory)
 * do resto da aplicação. O OutboxWorker usa esta interface para publicar
 * sem saber o destino concreto.
 *
 * IMPLEMENTAÇÕES:
 *   - RedisStreamTransport  → produção (Redis Streams via `XADD`)
 *   - InMemoryTransport     → testes e modo headless CI
 *
 * REDIS STREAMS vs PUB/SUB:
 *   Streams (`XADD`/`XREADGROUP`) são escolhidos em vez de Pub/Sub porque:
 *   - Persistem mensagens (Pub/Sub não persiste)
 *   - Suportam Consumer Groups (múltiplos workers sem duplicata)
 *   - Suportam ACK explícito (`XACK`)
 *   - Permitem replay (`XRANGE`)
 *
 * ESTRUTURA NO REDIS:
 *   Stream key: `jaeger:events:{eventName}`
 *   Ex: `jaeger:events:ComponentDeclaredIntegrationEvent`
 *
 *   Cada entrada do stream contém:
 *   - entryId: string   (gerado pelo Redis: "1234567890-0")
 *   - outboxId: string  (ID do OutboxEntry — para correlação)
 *   - payload: string   (JSON do Integration Event)
 */
export interface IEventTransport {
    /**
     * Publica um evento no canal de transporte.
     *
     * @param eventName   Nome do evento (ex: "ComponentDeclaredIntegrationEvent")
     * @param outboxId    ID do OutboxEntry (para correlação e dedup)
     * @param payload     JSON serializado do Integration Event
     * @returns           ID da mensagem no transporte (ex: Redis Stream entry ID)
     */
    publish(
        eventName: string,
        outboxId: string,
        payload: string,
    ): Promise<string>;

    /**
     * Verifica conectividade com o transporte. Usado pelo health check.
     */
    ping(): Promise<boolean>;
}
