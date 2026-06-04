import { UniqueEntityId } from "./UniqueEntityId.js";

/**
 * Entity — Abstract foundation for local entities.
 *
 * Enforces identity, structural equality, and the Chronos Protocol.
 * STATE IS ENCAPSULATED. Mutation is only allowed via internal domain logic.
 */
export abstract class Entity {
    public readonly id: UniqueEntityId<any>;
    public readonly createdAt: Date;
    private _updatedAt: Date;

    constructor(id: UniqueEntityId<any>, createdAt?: Date, updatedAt?: Date) {
        this.id = id;
        this.createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? this.createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    protected incrementChronos(): void {
        this._updatedAt = new Date();
    }

    equals(other: Entity): boolean {
        if (other === null || other === undefined) return false;
        if (other === this) return true;

        if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
            return false;
        }

        return this.id.equals(other.id);
    }
}
