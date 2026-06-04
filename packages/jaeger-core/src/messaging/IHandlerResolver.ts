import type { AppError, Result } from "@jaeger/shared-contracts";
import type { CommandOutcome } from "../application/CommandOutcome.js";
import type { ICommand, IQuery } from "../application/CommandQueryMarkers.js";
import type { CallerContext } from "../auth/CallerContext.js";

/**
 * Forma mínima de um Command Handler que o CommandBus invoca.
 * Equivale ao método `execute` de BaseCommandUseCase.
 */
export interface CommandHandler<TCommand extends ICommand, TResult> {
    execute(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<CommandOutcome<TResult>, AppError[]>>;
}

/**
 * Forma mínima de um Query Handler que o QueryBus invoca.
 * Equivale ao método `execute` de BaseQueryUseCase.
 */
export interface QueryHandler<TQuery extends IQuery, TResult> {
    execute(query: TQuery): Promise<Result<TResult, AppError[]>>;
}

/**
 * IHandlerResolver — Resolve handlers por tipo de Command/Query.
 *
 * MOTIVO DE NÃO USAR `IDIContainer` GENÉRICO:
 *   Um container DI é uma preocupação ampla (cria qualquer coisa).
 *   O Bus precisa apenas resolver handlers para mensagens. Esta interface
 *   focada respeita o Interface Segregation Principle (ISP) e facilita
 *   testes (basta um Map<ConstructorName, Handler>).
 *
 * IMPLEMENTAÇÃO TÍPICA (em apps/backend/src/main/composition/):
 *
 *   class MapBasedHandlerResolver implements IHandlerResolver {
 *     private commandHandlers = new Map<string, CommandHandler<any, any>>();
 *     private queryHandlers = new Map<string, QueryHandler<any, any>>();
 *
 *     register(commandClass: Function, handler: CommandHandler<any, any>) {
 *       this.commandHandlers.set(commandClass.name, handler);
 *     }
 *
 *     resolveCommandHandler<C, R>(command: C): CommandHandler<C, R> {
 *       const name = command.constructor.name;
 *       const handler = this.commandHandlers.get(name);
 *       if (!handler) throw new Error(`No handler for ${name}`);
 *       return handler as CommandHandler<C, R>;
 *     }
 *   }
 *
 * Os handlers são instanciados no Composition Root (apps/backend/src/main)
 * e registrados aqui via wire*Layer functions.
 */
export interface IHandlerResolver {
    /**
     * Encontra o CommandHandler registrado para o tipo do command.
     * Tipicamente usa `command.constructor.name` como chave.
     *
     * @throws InfrastructureError se nenhum handler foi registrado para o tipo.
     */
    resolveCommandHandler<TCommand extends ICommand, TResult>(
        command: TCommand,
    ): CommandHandler<TCommand, TResult>;

    /**
     * Encontra o QueryHandler registrado para o tipo do query.
     */
    resolveQueryHandler<TQuery extends IQuery, TResult>(
        query: TQuery,
    ): QueryHandler<TQuery, TResult>;
}
