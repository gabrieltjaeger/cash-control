import { Mensality, MensalityProps } from "@core/entities/mensality";

import { View } from "@infra/types/view";

export class MensalityPresenter {
  static toDTO(mensality: Mensality): View<MensalityProps> {
    return {
      id: mensality.id.value,
      month: mensality.month,
      year: mensality.year,
      priceInCents: mensality.priceInCents.toString().normalize(),
      createdAt: mensality.createdAt,
      updatedAt: mensality.updatedAt,
    };
  }
}
