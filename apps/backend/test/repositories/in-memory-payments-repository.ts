import { Payment } from "@core/entities/payment";
import { PaymentsRepository } from "@core/repositories/payments-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = [];

  async create(payment: Payment): Promise<void> {
    this.items.push(payment);
  }

  async delete(payment: Payment): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(payment.id));
    this.items.splice(index, 1);
  }

  async find<T extends RepositoryQueryMode>(
    mode: T,
    { id }: { id?: string | undefined }
  ): Promise<any> {
    const payment = this.items.find((item) => item.id.toString() === id);

    if (!payment) return null;

    return payment;
  }
  
  async list(mode: RepositoryQueryMode, { since, until }: { since: Date; until: Date; }, page?: number | undefined, take?: number | undefined): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
