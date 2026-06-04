import { BaseAppError } from "./BaseAppError.js";

/**
 * DomainError — Violação de uma invariante ou regra de negócio do domínio.
 *
 * QUANDO USAR:
 *   - Tentativa de criar um Aggregate em estado inválido
 *   - Operação proibida pelo estado atual (ex: cancelar pedido já entregue)
 *   - Quebra de uma regra de negócio explícita
 *
 * QUANDO NÃO USAR:
 *   - Entrada malformada do usuário → ValidationError
 *   - Recurso ausente → NotFoundError
 *   - Falha técnica → InfrastructureError
 *
 * Subclasses por módulo são esperadas:
 *   - ForbiddenModuleNameError    (compiler/modeling)
 *   - LocalEntityCannotHaveRepositoryError
 *   - TokenAlreadyRevokedError    (access/identity)
 *
 * MAPEAMENTO HTTP: tipicamente 422 Unprocessable Entity.
 */
export abstract class DomainError extends BaseAppError {
    constructor(
        code: string,
        message: string,
        context: Record<string, unknown> = {},
        cause?: BaseAppError | Error,
    ) {
        super("DomainError", code, message, context, cause);
    }
}
