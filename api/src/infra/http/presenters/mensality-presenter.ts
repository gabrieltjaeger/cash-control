import { Mensality, MensalityProps } from "@core/entities/mensality";

import { View } from "@infra/types/view";

export class MensalityPresenter {
  static toDTO(mensality?: Mensality): View<MensalityProps> {
    if (mensality)
      return {
        id: mensality.id,
        month: mensality.month,
        year: mensality.year,
        priceInCents: mensality.priceInCents,
        createdAt: mensality.createdAt,
        updatedAt: mensality.updatedAt,
      };
  }
}
