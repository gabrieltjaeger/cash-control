import { BaseAppError } from "./BaseAppError.js";

/**
 * AuthenticationError — Falha de autenticacao (token ausente/invalido).
 *
 * MAPEAMENTO HTTP: 401 Unauthorized.
 */
export class AuthenticationError extends BaseAppError {
    constructor(
        code: string,
        message: string,
        context: Record<string, unknown> = {},
    ) {
        super("AuthenticationError", code, message, context);
    }
}
