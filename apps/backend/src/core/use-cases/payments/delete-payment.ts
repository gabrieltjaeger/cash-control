import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";
import { PaymentsRepository } from "@core/repositories/payments-repository";

interface DeletePaymentUseCaseRequest {
  id: string;
}

export class DeletePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({ id }: DeletePaymentUseCaseRequest): Promise<void> {
    const payment = await this.paymentsRepository.find("minimal", { id });

    if (!payment) {
      throw new ResourceNotFoundError("Payment", `id ${id}`);
    }

    await this.paymentsRepository.delete(payment);
  }
}
