import { User, UserProps } from "@core/entities/user";

import { View } from "@infra/types/view";

export class UserPresenter {
  static toDTO(user?: User): View<UserProps> {
    if (user)
      return {
        id: user.id.value,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        active: user.active,
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  }
}
