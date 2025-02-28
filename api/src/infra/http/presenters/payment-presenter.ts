import { Payment, PaymentProps } from "@core/entities/payment";

import { AssociatePresenter } from "@infra/http/presenters/associate-presenter";

import { View } from "@infra/types/view";
import { MensalityPresenter } from "./mensality-presenter";

export class PaymentPresenter {
  static toDTO(payment?: Payment): View<PaymentProps> {
    if (payment)
      return {
        id: payment.id.value,
        date: payment.date,
        associateId: payment.associateId,
        associate: AssociatePresenter.toDTO(payment.associate ?? undefined),
        mensalities: payment.mensalities.flatMap((mensality) =>
          MensalityPresenter.toDTO(mensality.mensality ?? undefined)
        ),
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
  }
}
