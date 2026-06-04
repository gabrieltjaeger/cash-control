import { Address, AddressProps } from "@core/entities/address";

import { View } from "@infra/types/view";

export class AddressPresenter {
  static toDTO(address?: Address): View<AddressProps> {
    if (address)
      return {
        id: address.id.value,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zipCode,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      };
  }
}
