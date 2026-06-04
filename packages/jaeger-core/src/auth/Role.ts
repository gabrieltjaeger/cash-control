import { Err, Ok, type Result } from "@jaeger/shared-contracts";
import { ValidationError } from "../errors/ValidationError.js";
import { Permission } from "./Permission.js";
import { AggregateRoot } from "../domain/AggregateRoot.js";
import { UniqueEntityId } from "../domain/UniqueEntityId.js";

export type RoleId = UniqueEntityId<"Role">;
/**
 * Role — Value Object que agrupa um conjunto de Permissions sob um nome semântico.
 *
 * IMUTABILIDADE: uma Role nunca muda suas permissões após criação.
 * Para "editar" uma role, cria-se uma nova instância com as permissões
 * desejadas (o Aggregate RoleAggregate em access/identity gerencia esse ciclo).
 *
 * SYSTEM ROLES vs CUSTOM ROLES:
 *   System roles são pré-definidas em DefaultRoles e não podem ser deletadas.
 *   Custom roles são criadas por admins via RoleAggregate em access/identity.
 *
 * HIERARQUIA:
 *   Não há herança entre roles. Um perfil pode ter múltiplas roles
 *   (ex: "developer" + "template-manager"), e a union das permissões é usada.
 */
export class Role extends AggregateRoot {
    private readonly _permissions: Set<string>;

    private constructor(
        id: RoleId,
        version: number,
        public readonly isSystem: boolean,
        public readonly name: string,
        permissions: Permission[],
    ) {
        super(id, version);
        this._permissions = new Set(permissions.map((p) => p.value));
    }

    static create(
        name: string,
        permissions: Permission[],
        isSystem = false,
    ): Result<Role, ValidationError> {
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return Err(
                ValidationError.forField(
                    "name",
                    "Role name must be at least 2 characters",
                    name,
                ),
            );
        }
        if (permissions.length === 0) {
            return Err(
                ValidationError.forField(
                    "permissions",
                    "A role must have at least one permission",
                ),
            );
        }
        return Ok(
            new Role(
                UniqueEntityId.create(),
                0,
                isSystem,
                name.trim(),
                permissions,
            ),
        );
    }

    static reconstitute(
        id: string,
        version: number,
        isSystem: boolean,
        name: string,
        permissions: string[],
    ): Role {
        return new Role(
            UniqueEntityId.reconstituteTrusted(id),
            version,
            isSystem,
            name,
            permissions.map((p) => Permission.reconstitute(p)),
        );
    }

    /**
     * Verifica se esta Role concede a Permission requerida.
     * Leva em conta wildcards (ex: "component:*" satisfaz "component:create").
     */
    hasPermission(required: Permission): boolean {
        for (const raw of this._permissions) {
            const p = Permission.reconstitute(raw);
            if (p.satisfies(required)) return true;
        }
        return false;
    }

    get permissions(): ReadonlyArray<string> {
        return [...this._permissions];
    }
}
