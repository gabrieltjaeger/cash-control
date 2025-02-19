import { Address } from "@core/entities/address";
import { Entity, EntityRequest } from "@core/entities/entity";
import { Payment } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";

export interface AssociateProps extends EntityRequest {
  fullName: string;
  email: string;
  phone: string;

  addressId: CUID;
  address?: Address;

  payments?: Map<string, Payment>;
}

export class Associate extends Entity<AssociateProps> {
  static create(props: AssociateProps): Associate {
    return new Associate(props);
  }

  get fullName(): string {
    return this.props.fullName;
  }

  set fullName(fullName: string) {
    this.props.fullName = fullName;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get phone(): string {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get addressId(): CUID {
    return this.props.addressId;
  }

  get address(): Address | null {
    return this.props.address ?? null;
  }

  get payments(): Map<string, Payment> {
    return this.props.payments ?? new Map<string, Payment>();
  }
}
