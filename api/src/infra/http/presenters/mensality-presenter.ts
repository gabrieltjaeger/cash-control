import { Mensality, MensalityProps } from "@core/entities/mensality";

import { PaymentPresenter } from "@infra/http/presenters/payment-presenter";

import { View } from "@infra/types/view";

export class MensalityPresenter {
  static toDTO(mensality?: Mensality): View<MensalityProps> {
    if (mensality)
      return {
        id: mensality.id.value,
        month: mensality.month,
        year: mensality.year,
        priceInCents: mensality.priceInCents.toString().normalize(),
        payments: Array.from(mensality.payments).map(([_, payment]) =>
          PaymentPresenter.toDTO(payment)
        ),
        createdAt: mensality.createdAt,
        updatedAt: mensality.updatedAt,
      };
  }
}
