import type { AppError, AppErrorCategory } from "@jaeger/shared-contracts";

/**
 * BaseAppError — Implementação backend da interface AppError de shared-contracts.
 *
 * RAZÃO DE EXISTIR:
 *   - shared-contracts define a INTERFACE serializável `AppError`.
 *   - Frontend trabalha apenas com essa interface (plain object via JSON).
 *   - Backend precisa de hierarquia rica (subclasses, instanceof, toJSON).
 *
 * Esta classe é a ponte: implementa a interface compartilhada e serve de
 * raiz para todas as subclasses concretas (DomainError, NotFoundError, etc.).
 *
 * Ao serializar via JSON.stringify, a instância torna-se plain object
 * conforme a interface, e o frontend consome diretamente.
 *
 * REGRA CRÍTICA: subclasses NUNCA estendem `Error` nativo. Apenas BaseAppError.
 */
export abstract class BaseAppError extends Error implements AppError {
    public readonly code: string;
    public readonly category: AppErrorCategory;
    public readonly context: Record<string, unknown>;
    public readonly occurredAt: string;

    constructor(
        category: AppErrorCategory,
        code: string,
        message: string,
        context: Record<string, unknown> = {},
        cause?: BaseAppError | Error,
    ) {
        super(message, { cause: cause instanceof Error ? cause : undefined });
        this.category = category;
        this.code = code;
        this.context = Object.freeze({ ...context });
        this.occurredAt = new Date().toISOString();
    }

    /**
     * Serialização canônica para wire (WebSocket/HTTP).
     * Resultado satisfaz a interface AppError exatamente.
     * NÃO inclui `cause` (preocupação interna do backend).
     */
    public toJSON(): AppError {
        return {
            code: this.code,
            message: this.message,
            category: this.category,
            context: this.context,
            occurredAt: this.occurredAt,
        };
    }
}
