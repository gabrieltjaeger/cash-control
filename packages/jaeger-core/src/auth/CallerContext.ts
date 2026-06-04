import { Err, Ok, type Result } from "@jaeger/shared-contracts";
import { ValidationError } from "../errors/ValidationError.js";
import { Permission } from "./Permission.js";

/**
 * CallerContext — Identidade autenticada e autorizada do caller.
 *
 * É o único objeto que circula pelas camadas de aplicação representando
 * "quem está fazendo esta operação". Criado pelo AuthenticationMiddleware
 * e injetado em Use Cases que precisam de contexto de autorização.
 *
 * FLUXO DE CRIAÇÃO:
 *   HTTP/WebSocket request
 *   → AuthenticationMiddleware valida o token
 *   → Carrega perfil + roles do banco
 *   → Constrói CallerContext com permissions computadas
 *   → Injeta no Input DTO do Use Case
 *
 * POR QUE NÃO INJETAR NO CONSTRUTOR DO USE CASE:
 *   Injetar CallerContext no Input DTO (e não via construtor DI) é uma
 *   decisão deliberada. O Use Case não sabe "de onde veio" o contexto —
 *   pode ser HTTP, WebSocket, CLI ou testes. O Input DTO carrega o
 *   contexto junto com os dados da operação.
 *
 * ATRIBUTOS ABAC:
 *   O campo `attributes` carrega informações extras para políticas ABAC:
 *   - teamId: para isolar operações ao time do caller
 *   - projectIds: projetos aos quais o caller tem acesso
 *   - customAttributes: qualquer coisa que uma policy ABAC precise
 */
export class CallerContext {
    private readonly _computedPermissions: ReadonlySet<string>;

    private constructor(
        public readonly callerId: string,
        public readonly profileId: string,
        public readonly roleNames: ReadonlyArray<string>,
        rawPermissions: string[],
        public readonly attributes: Readonly<Record<string, unknown>>,
    ) {
        this._computedPermissions = new Set(rawPermissions);
    }

    static create(props: {
        callerId: string;
        profileId: string;
        roleNames: string[];
        permissions: string[];
        attributes?: Record<string, unknown>;
    }): Result<CallerContext, ValidationError> {
        if (!props.callerId?.trim()) {
            return Err(
                ValidationError.forField("callerId", "callerId is required"),
            );
        }
        if (!props.profileId?.trim()) {
            return Err(
                ValidationError.forField("profileId", "profileId is required"),
            );
        }
        return Ok(
            new CallerContext(
                props.callerId,
                props.profileId,
                [...props.roleNames],
                [...props.permissions],
                Object.freeze({ ...props.attributes }),
            ),
        );
    }

    /**
     * Cria CallerContext para uso em testes sem overhead de validação.
     */
    static forTesting(
        overrides: Partial<{
            callerId: string;
            profileId: string;
            roleNames: string[];
            permissions: string[];
            attributes: Record<string, unknown>;
        }> = {},
    ): CallerContext {
        return new CallerContext(
            overrides.callerId ?? "caller_test",
            overrides.profileId ?? "profile_test",
            overrides.roleNames ?? ["developer"],
            overrides.permissions ?? ["component:create", "component:read"],
            overrides.attributes ?? {},
        );
    }

    /**
     * Verifica se o caller tem a permission requerida.
     * Considera wildcards (ex: "component:*" satisfaz "component:create").
     */
    hasPermission(required: Permission): boolean {
        for (const raw of this._computedPermissions) {
            const p = Permission.reconstitute(raw);
            if (p.satisfies(required)) return true;
        }
        return false;
    }

    /**
     * Verifica múltiplas permissions (AND — precisa ter todas).
     */
    hasAllPermissions(required: Permission[]): boolean {
        return required.every((p) => this.hasPermission(p));
    }

    /**
     * Verifica múltiplas permissions (OR — basta ter uma).
     */
    hasAnyPermission(required: Permission[]): boolean {
        return required.some((p) => this.hasPermission(p));
    }

    hasRole(roleName: string): boolean {
        return this.roleNames.includes(roleName);
    }

    get permissions(): ReadonlyArray<string> {
        return [...this._computedPermissions];
    }

    /**
     * Acessa um atributo ABAC tipado.
     * Usado pelas políticas ABAC para recuperar contexto específico.
     */
    getAttribute<T>(key: string): T | undefined {
        return this.attributes[key] as T | undefined;
    }
}
