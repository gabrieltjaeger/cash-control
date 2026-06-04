import { BaseAppError } from "./BaseAppError.js";

/**
 * ForbiddenError — O caller está autenticado mas não autorizado.
 *
 * MAPEAMENTO HTTP: 403 Forbidden.
 */
export class ForbiddenError extends BaseAppError {
    public readonly action: string;
    public readonly callerId?: string;
    public readonly requiredPermission?: string;

    constructor(
        action: string,
        message?: string,
        callerId?: string,
        requiredPermission?: string,
        context: Record<string, unknown> = {},
    ) {
        super(
            "ForbiddenError",
            "FORBIDDEN",
            message ?? `Action not allowed: ${action}`,
            {
                action,
                callerId,
                requiredPermission,
                ...context,
            },
        );
        this.action = action;
        this.callerId = callerId;
        this.requiredPermission = requiredPermission;
    }
}
