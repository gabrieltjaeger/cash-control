import { Month } from "@core/entities/mensality";
import { Payment } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";
import { MensalitiesRepository } from "@core/repositories/mensalities-repository";
import { PaymentsRepository } from "@core/repositories/payments-repository";

interface RegisterPaymentRequest {
  associateId: string;
  date?: Date;
  mensalities: { month: Month; year: number }[];
}

export class RegisterPaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private mensalitiesRepository: MensalitiesRepository
  ) {}

  async execute({
    associateId,
    date,
    mensalities,
  }: RegisterPaymentRequest): Promise<void> {
    if (mensalities.length === 0) {
      throw new Error("No mensalities provided");
    }

    const mensalitiesEntities = await Promise.all(
      mensalities
        .map(({ month, year }) =>
          this.mensalitiesRepository.find("expanded", {
            month,
            year,
            associate: { id: associateId },
          })
        )
        .filter((mensality) => mensality !== null)
    );

    if (mensalitiesEntities.length < mensalities.length) {
      throw new Error("Some mensalities were not found");
    }

    const payment = Payment.create({
      associateId: new CUID(associateId),
      date: date ?? new Date(),
      paidMensalities: new Map(
        mensalitiesEntities.map((mensality) => [
          mensality!.id.value,
          mensality!,
        ])
      ),
    });

    await this.paymentsRepository.create(payment);
  }
}
