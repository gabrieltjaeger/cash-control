import type {
    AppError,
    FieldError,
    ValidationErrorShape,
} from "@jaeger/shared-contracts";
import { BaseAppError } from "./BaseAppError.js";

/**
 * ValidationError — Entrada malformada na fronteira do sistema.
 *
 * Implementa a interface ValidationErrorShape de shared-contracts,
 * adicionando `fields` ao formato serializável.
 *
 * Carrega array de FieldError permitindo reportar múltiplas falhas
 * simultaneamente (uma boa UX exibe todos os erros de um form de uma vez).
 *
 * MAPEAMENTO HTTP: 400 Bad Request.
 */
export class ValidationError extends BaseAppError {
    public readonly fields: ReadonlyArray<FieldError>;

    constructor(
        message: string,
        fields: FieldError[] = [],
        context: Record<string, unknown> = {},
    ) {
        super("ValidationError", "VALIDATION_ERROR", message, context);
        this.fields = Object.freeze([...fields]);
    }

    /**
     * Helper para criar ValidationError de campo único.
     */
    public static forField(
        field: string,
        message: string,
        rejectedValue?: unknown,
    ): ValidationError {
        return new ValidationError(`Validation failed for field '${field}'`, [
            { field, message, rejectedValue },
        ]);
    }

    /**
     * Combina múltiplos ValidationError em um único.
     */
    public static merge(
        errors: ValidationError[],
        message = "Multiple validation errors",
    ): ValidationError {
        const allFields = errors.flatMap((e) => [...e.fields]);
        return new ValidationError(message, allFields);
    }

    public override toJSON(): AppError {
        // Override para incluir fields no shape serializado
        return {
            ...super.toJSON(),
            fields: this.fields,
        } as ValidationErrorShape;
    }
}
