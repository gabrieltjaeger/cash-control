import { Associate, AssociateProps } from "@core/entities/associate";

import { AddressPresenter } from "@infra/http/presenters/address-presenter";
import { PaymentPresenter } from "@infra/http/presenters/payment-presenter";

import { View } from "@infra/types/view";

export class AssociatePresenter {
  static toDTO(associate?: Associate): View<AssociateProps> {
    if (associate)
      return {
        id: associate.id.value,
        fullName: associate.fullName,
        email: associate.email,
        phone: associate.phone,
        addressId: associate.addressId,
        address: AddressPresenter.toDTO(associate.address ?? undefined),
        payments: Array.from(associate.payments).map(([_, payment]) =>
          PaymentPresenter.toDTO(payment)
        ),
        createdAt: associate.createdAt,
        updatedAt: associate.updatedAt,
      };
  }
}
