import type { AppError, Result } from "@jaeger/shared-contracts";
import type { ICommand } from "../application/CommandQueryMarkers.js";
import type { CallerContext } from "../auth/CallerContext.js";

/**
 * ICommandBus — Despachador central de Commands.
 *
 * RESPONSABILIDADES (delegadas dos Use Cases para esta abstração):
 *   1. Resolução de handler pelo tipo do Command
 *   2. Idempotência via IIdempotencyService (check/seal)
 *   3. Transação via IUnitOfWork (begin/commit/rollback)
 *   4. Persistência dos aggregates do CommandOutcome
 *   5. Outbox: gravação dos Domain Events na tabela
 *   6. Limpeza de Domain Events nos aggregates após commit
 *
 * O Use Case fica focado em LÓGICA DE DOMÍNIO PURA. Toda orquestração
 * de I/O fica aqui.
 *
 * EXEMPLO DE USO PELO MessageDispatcher (rota WebSocket → CommandBus):
 *
 *   dispatcher.register('CREATE_PROFILE', async (payload) => {
 *     const command = new CreateProfileCommand(payload);
 *     return await commandBus.execute(command);
 *   });
 */
export interface ICommandBus {
    /**
     * Despacha um Command para seu handler registrado.
     *
     * Retorno é genérico em TResult para suportar Read-Your-Own-Writes:
     * Commands podem retornar IDs recém-criados ou DTOs minimalistas.
     *
     * O erro é `AppError[]` (array) para suportar applicative validation
     * (múltiplas falhas reportadas juntas — usado em validações de form).
     */
    execute<TCommand extends ICommand, TResult = void>(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<TResult, AppError[]>>;
}
