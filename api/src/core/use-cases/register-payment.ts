import { Month } from "@core/entities/mensality";
import { Payment } from "@core/entities/payment";
import { PaymentMensality } from "@core/entities/payment-mensality";
import { AssociatesRepository } from "@core/repositories/associates-repository";
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
    private mensalitiesRepository: MensalitiesRepository,
    private associatesRepository: AssociatesRepository
  ) {}

  async execute({
    associateId,
    date,
    mensalities,
  }: RegisterPaymentRequest): Promise<void> {
    if (mensalities.length === 0) {
      throw new Error("No mensalities provided");
    }

    const associate = await this.associatesRepository.find("minimal", {
      id: associateId,
    });

    if (!associate) {
      throw new Error("Associate not found");
    }

    const _mensalities = await Promise.all(
      mensalities.map(async ({ month, year }) => {
        const mensality = await this.mensalitiesRepository.find("minimal", {
          month,
          year,
        });

        if (!mensality) {
          throw new Error(`Mensality ${month}/${year} not registered`);
        }

        return mensality;
      })
    );

    const payment = Payment.create({
      associateId: associate.id,
      date: date || new Date(),
    });

    payment.mensalities = _mensalities.map((mensality) =>
      PaymentMensality.create({
        paymentId: payment.id,
        mensalityId: mensality.id,
      })
    );

    await this.paymentsRepository.create(payment);
  }
}
