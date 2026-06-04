import { DomainError } from "@core/errors/domain-error";

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, value: string) {
    super(`${resource} with ${value} not found`, 404);
  }
}
