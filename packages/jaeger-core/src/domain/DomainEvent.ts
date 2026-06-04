/**
 * DomainEvent — Abstract foundation for historical business facts.
 * 
 * ENFORCES IMMUTABILITY. The past cannot be altered.
 * Survives compilation to allow runtime reflection (routing by class name).
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventName: string;

  constructor(
    public readonly aggregateId: string,
    public readonly aggregateType: string = "UnknownAggregate",
    public readonly payload: Record<string, unknown> = {},
  ) {
    this.occurredAt = new Date();
    this.eventName = this.constructor.name; 
  }
}
