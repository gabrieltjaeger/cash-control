import {
    Err,
    Ok,
    isErr,
    type AppError,
    type Result,
} from "@jaeger/shared-contracts";
import type { ICommand } from "../application/CommandQueryMarkers.js";
import type { IIdempotencyService } from "../contracts/IIdempotencyService.js";
import type { IUnitOfWork } from "../contracts/IUnitOfWork.js";
import type { CallerContext } from "../auth/CallerContext.js";
import type { IAuthorizationService } from "../auth/IAuthorizationService.js";
import type { Permission } from "../auth/Permission.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { InfrastructureError } from "../errors/InfrastructureError.js";
import type { ICommandBus } from "./ICommandBus.js";
import type { IHandlerResolver } from "./IHandlerResolver.js";

/**
 * CommandBus — Implementação concreta do despachador de Commands.
 *
 * SEQUÊNCIA DE EXECUÇÃO (Template Method):
 *
 *   1. Resolve handler pelo tipo do Command (via IHandlerResolver)
 *
 *   2. Inicia transação (uow.begin)
 *
 *   3. Verifica idempotência:
 *      - SEALED → retorna resultado cacheado (sem executar lógica)
 *      - PROCESSING → retorna ConflictError
 *      - NEW → prossegue
 *
 *   4. Marca como processing (na mesma transação)
 *
 *   5. Invoca handler.execute(command) → recebe CommandOutcome ou Err
 *
 *   6a. Se Err: rollback + sela falha (para que retries retornem mesmo erro)
 *       (selar a falha exige nova transação, pois a primeira foi revertida)
 *
 *   6b. Se Ok: persiste aggregates do outcome
 *       - uow.save(aggregate) para cada
 *       - uow.commitEvents(allDomainEvents)
 *       - sela sucesso
 *       - uow.commit()
 *       - clearDomainEvents nos aggregates
 *
 *   7. Retorna Result<TResult, AppError[]> ao caller
 *
 * NOTA SOBRE SEAL DE FALHAS:
 *   Selamos falhas porque retentar uma operação que falhou por motivo
 *   determinístico de negócio (ex: email duplicado) deve produzir o
 *   mesmo erro. Selar a falha exige uma SEGUNDA transação após rollback —
 *   isso é aceitável porque o cenário de retry de falha é exceção, não regra.
 */
export class CommandBus implements ICommandBus {
    constructor(
        private readonly resolver: IHandlerResolver,
        private readonly uow: IUnitOfWork,
        private readonly idempotency: IIdempotencyService,
        private readonly authService?: IAuthorizationService,
    ) {}

    public async execute<TCommand extends ICommand, TResult = void>(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<TResult, AppError[]>> {
        if (!caller) {
            return Err([
                new AuthenticationError(
                    "CALLER_CONTEXT_REQUIRED",
                    "CallerContext is required for command execution.",
                ),
            ]);
        }

        // 1. Resolver handler
        let handler;
        try {
            handler = this.resolver.resolveCommandHandler<TCommand, TResult>(
                command,
            );
        } catch (err) {
            return Err([this.toInfraError(err, "command-bus-resolve")]);
        }

        try {
            return await this.uow.runInTransaction<Result<TResult, AppError[]>>(async () => {
                const authDecision = await this.authorize<TCommand, TResult>(
                    command,
                    caller,
                );
                if (authDecision) {
                    return authDecision;
                }

                const idemState = await this.idempotency.check(
                    command.idempotencyKey,
                );

                if (idemState.status === "processing") {
                    return Err([
                        new ConflictError(
                            "IdempotencyKey",
                            command.idempotencyKey,
                            "Operation with this idempotency key is still in progress.",
                            { startedAt: idemState.startedAt.toISOString() },
                        ),
                    ]);
                }

                if (idemState.status === "sealed") {
                    if (idemState.payload.kind === "success") {
                        return Ok(idemState.payload.value as TResult);
                    }
                    return Err([...idemState.payload.errors]);
                }

                await this.idempotency.markProcessing(command.idempotencyKey);

                const outcomeResult = await handler.execute(command, caller);

                if (isErr(outcomeResult)) {
                    await this.idempotency.seal(command.idempotencyKey, {
                        kind: "failure",
                        errors: outcomeResult.error,
                    });
                    return outcomeResult;
                }

                const outcome = outcomeResult.value;
                for (const aggregate of outcome.aggregates) {
                    await this.uow.save(aggregate);
                }

                const allEvents = outcome.aggregates.flatMap((ag) => [
                    ...ag.domainEvents,
                ]);
                if (allEvents.length > 0) {
                    await this.uow.commitEvents(allEvents);
                }

                await this.idempotency.seal(command.idempotencyKey, {
                    kind: "success",
                    value: outcome.result,
                });

                await this.uow.commit();

                for (const aggregate of outcome.aggregates) {
                    aggregate.clearDomainEvents();
                }

                return Ok(outcome.result);
            });
        } catch (err) {
            return Err([this.toInfraError(err, "command-bus-execute")]);
        }
    }

    private async authorize<TCommand extends ICommand, TResult>(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<TResult, AppError[]> | null> {
        const commandClass = command.constructor as {
            requiredPermission?: Permission;
        };
        if (!commandClass.requiredPermission || !this.authService) return null;

        const decision = await this.authService.authorize(
            caller,
            commandClass.requiredPermission,
        );
        if (decision.isPermit) return null;

        return Err([
            new ForbiddenError(
                commandClass.requiredPermission.value,
                decision.reason,
            ),
        ]);
    }

    private toInfraError(err: unknown, subsystem: string): AppError {
        if (err instanceof Error) {
            return new InfrastructureError(subsystem, err.message, {
                cause: err,
                isRetryable: false,
            });
        }
        return new InfrastructureError(
            subsystem,
            "Unknown error during command dispatch",
            { isRetryable: false },
        );
    }
}
