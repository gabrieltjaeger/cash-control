import { Err, Ok, type Result } from "@jaeger/shared-contracts";
import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../domain/ValueObject.js";

/**
 * Permission — Value Object que representa uma capacidade atômica do sistema.
 *
 * FORMATO: "resource:action"
 *
 *   resource → o que está sendo acessado
 *   action   → o que está sendo feito
 *
 * EXEMPLOS:
 *   "component:create"     → criar componentes
 *   "violation:ignore"     → ignorar violações arquiteturais
 *   "policy:activate"      → ativar políticas do workspace
 *   "generation:approve"   → aprovar geração de código
 *   "role:manage"          → criar/editar/deletar roles
 *   "team:manage_members"  → gerenciar membros da equipe
 *
 * WILDCARD:
 *   "component:*"          → todas as ações em component
 *   "*:read"               → ler qualquer recurso
 *   "*"                    → tudo (apenas owner do sistema)
 *
 * CATÁLOGO COMPLETO: veja PermissionCatalog abaixo.
 * Módulos podem estender adicionando novas strings ao formato resource:action.
 *
 * IMUTABILIDADE: Permission é imutável após criação. Não tem id.
 */
export class Permission extends ValueObject {
    private constructor(
        public readonly resource: string,
        public readonly action: string,
    ) {
        super();
    }

    get value(): string {
        if (this.resource === "*" && this.action === "*") return "*";
        return `${this.resource}:${this.action}`;
    }

    static create(raw: string): Result<Permission, ValidationError> {
        if (!raw || typeof raw !== "string") {
            return Err(
                ValidationError.forField(
                    "permission",
                    "Permission must be a non-empty string",
                ),
            );
        }

        if (raw === "*") {
            return Ok(new Permission("*", "*"));
        }

        const parts = raw.split(":");
        if (parts.length !== 2) {
            return Err(
                ValidationError.forField(
                    "permission",
                    `Permission must follow "resource:action" format, got: "${raw}"`,
                    raw,
                ),
            );
        }

        const [resource, action] = parts as [string, string];

        if (!resource.trim() || !action.trim()) {
            return Err(
                ValidationError.forField(
                    "permission",
                    "Resource and action must be non-empty",
                    raw,
                ),
            );
        }

        return Ok(new Permission(resource.trim(), action.trim()));
    }

    /**
     * Reconstitui sem validação (vindo do banco ou de uma constante tipada).
     */
    static reconstitute(raw: string): Permission {
        if (raw === "*") return new Permission("*", "*");
        const [resource, action] = raw.split(":") as [string, string];
        return new Permission(resource, action);
    }

    /**
     * Verifica se esta Permission satisfaz uma Permission requerida.
     * Suporta wildcard: "component:*" satisfaz "component:create".
     */
    satisfies(required: Permission): boolean {
        // Wildcard total
        if (this.resource === "*") return true;

        // Resource deve casar
        if (this.resource !== required.resource) return false;

        // Wildcard de action
        if (this.action === "*") return true;

        return this.action === required.action;
    }

    override equals(other: Permission): boolean {
        if (other === null || other === undefined) return false;
        return this.value === other.value;
    }

    override toString(): string {
        return this.value;
    }
}
