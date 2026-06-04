import { Associate, AssociateProps } from "@core/entities/associate";
import { CUID } from "@core/entities/types/CUID";

export function makeAssociate(
  override: Partial<AssociateProps> = {},
  id?: CUID
) {
  const associate = Associate.create({
    fullName: "John Doe",
    email: "jonhdoe@email.com",
    phone: "123456789",
    addressId: new CUID(),
    ...override,
    id,
  });

  return associate;
}
