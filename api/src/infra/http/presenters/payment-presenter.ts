import { Payment, PaymentProps } from "@core/entities/payment";

import { AssociatePresenter } from "@infra/http/presenters/associate-presenter";
import { MensalityPresenter } from "@infra/http/presenters/mensality-presenter";

import { View } from "@infra/types/view";

export class PaymentPresenter {
  static toDTO(payment?: Payment): View<PaymentProps> {
    if (payment)
      return {
        id: payment.id.value,
        date: payment.date,
        associateId: payment.associateId,
        associate: AssociatePresenter.toDTO(payment.associate ?? undefined),
        paidMensalities: Array.from(payment.paidMensalities).map(
          ([_, mensality]) => MensalityPresenter.toDTO(mensality)
        ),
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
  }
}
