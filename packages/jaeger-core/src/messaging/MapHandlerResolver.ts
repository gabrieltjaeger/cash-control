import { InfrastructureError } from "../errors/InfrastructureError.js";
import type { ICommand, IQuery } from "../application/CommandQueryMarkers.js";
import type {
    CommandHandler,
    IHandlerResolver,
    QueryHandler,
} from "./IHandlerResolver.js";

export class MapHandlerResolver implements IHandlerResolver {
    private readonly commandHandlers = new Map<
        string,
        CommandHandler<any, any>
    >();
    private readonly queryHandlers = new Map<string, QueryHandler<any, any>>();

    public registerCommand<C extends ICommand, R>(
        commandClass: { name: string },
        handler: CommandHandler<C, R>,
    ): void {
        this.commandHandlers.set(commandClass.name, handler);
    }

    public registerQuery<Q extends IQuery, R>(
        queryClass: { name: string },
        handler: QueryHandler<Q, R>,
    ): void {
        this.queryHandlers.set(queryClass.name, handler);
    }

    public resolveCommandHandler<C extends ICommand, R>(
        command: C,
    ): CommandHandler<C, R> {
        const name = command.constructor.name;
        const handler = this.commandHandlers.get(name);
        if (!handler) {
            throw new InfrastructureError(
                "handler-resolver",
                `No command handler registered for: ${name}.`,
            );
        }
        return handler as CommandHandler<C, R>;
    }

    public resolveQueryHandler<Q extends IQuery, R>(
        query: Q,
    ): QueryHandler<Q, R> {
        const name = query.constructor.name;
        const handler = this.queryHandlers.get(name);
        if (!handler) {
            throw new InfrastructureError(
                "handler-resolver",
                `No query handler registered for: ${name}.`,
            );
        }
        return handler as QueryHandler<Q, R>;
    }
}
