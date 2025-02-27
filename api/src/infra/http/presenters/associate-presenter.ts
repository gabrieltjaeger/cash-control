import { Associate, AssociateProps } from "@core/entities/associate";

import { AddressPresenter } from "@infra/http/presenters/address-presenter";
import { MensalityPresenter } from "@infra/http/presenters/mensality-presenter";
import { PaymentPresenter } from "@infra/http/presenters/payment-presenter";

import { View } from "@infra/types/view";
import { omitFields } from "@shared/utils/object-utils";

export class AssociatePresenter {
  static toDTO(
    associate?: Associate,
    omit?: string[]
  ): View<AssociateProps> | null {
    if (!associate) return null;

    const DTO = {
      id: associate.id.value,
      fullName: associate.fullName,
      email: associate.email,
      phone: associate.phone,
      addressId: associate.addressId,
      address: AddressPresenter.toDTO(associate.address ?? undefined),
      payments: associate.payments.map((payment) =>
        PaymentPresenter.toDTO(payment)
      ),
      mensalities: associate.mensalities.flatMap((mensality) =>
        MensalityPresenter.toDTO(mensality.mensality ?? undefined)
      ),
      createdAt: associate.createdAt,
      updatedAt: associate.updatedAt,
    };

    return omit ? omitFields(DTO, omit) : DTO;
  }
}
