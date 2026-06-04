import { UniqueEntityId } from "./UniqueEntityId.js";
import { DomainEvent } from "./DomainEvent.js";
import { Entity } from "./Entity.js";

/**
 * AggregateRoot — Abstract foundation for transactional boundaries.
 *
 * Extends Entity to add Domain Events and OCC.
 * The Aggregate protects its invariants at all costs.
 */
export abstract class AggregateRoot extends Entity {
    private _version: number;
    private readonly _originalVersion: number;
    private _domainEvents: DomainEvent[] = [];

    constructor(
        id: UniqueEntityId<any>,
        version: number = 0,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        super(id, createdAt, updatedAt);
        this._version = version;
        this._originalVersion = version;
    }

    get version(): number {
        return this._version;
    }

    get originalVersion(): number {
        return this._originalVersion;
    }

    protected override incrementChronos(): void {
        super.incrementChronos();
        this._version += 1;
    }

    public addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    get domainEvents(): ReadonlyArray<DomainEvent> {
        return this._domainEvents;
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }

    protected apply(event: DomainEvent, mutator: () => void): void {
        mutator();
        this.incrementChronos();
        this.addDomainEvent(event);
    }
}
