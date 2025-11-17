import { PaymentsRepository } from "@core/repositories/payments-repository";

interface DeletePaymentUseCaseRequest {
  id: string;
}

export class DeletePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({ id }: DeletePaymentUseCaseRequest): Promise<void> {
    const payment = await this.paymentsRepository.find("minimal", { id });

    if (!payment) {
      throw new Error("Payment not found");
    }

    await this.paymentsRepository.delete(payment);
  }
}
