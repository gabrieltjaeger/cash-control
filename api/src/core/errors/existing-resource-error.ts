import { DomainError } from "@core/errors/domain-error";

export class ExistingResourceError extends DomainError {
  constructor(resource: string, value: string) {
    super(`${resource} with ${value} already exists`, 409);
  }
}
