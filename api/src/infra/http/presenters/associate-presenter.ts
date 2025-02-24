import { Associate, AssociateProps } from "@core/entities/associate";

import { View } from "@infra/types/view";

export class AssociatePresenter {
  static toDTO(associate?: Associate): View<AssociateProps> {
    if (associate)
      return {
        id: associate.id,
        fullName: associate.fullName,
        email: associate.email,
        phone: associate.phone,
        createdAt: associate.createdAt,
        updatedAt: associate.updatedAt,
      };
  }
}
