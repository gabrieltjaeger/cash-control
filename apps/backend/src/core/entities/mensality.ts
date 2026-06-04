import { AssociateMensality } from "@core/entities/associate-mensality";
import { Entity, EntityRequest } from "@core/entities/entity";
import { PaymentMensality } from "@core/entities/payment-mensality";

export type Month =
  | "JAN"
  | "FEB"
  | "MAR"
  | "APR"
  | "MAY"
  | "JUN"
  | "JUL"
  | "AUG"
  | "SEP"
  | "OCT"
  | "NOV"
  | "DEC";

export interface MensalityProps extends EntityRequest {
  month: Month;
  year: number;
  priceInCents: bigint;

  payments?: PaymentMensality[];
  associates?: AssociateMensality[];
}

export class Mensality extends Entity<MensalityProps> {
  static create(props: MensalityProps): Mensality {
    return new Mensality(props);
  }

  get month(): Month {
    return this.props.month;
  }

  set month(month: Month) {
    this.props.month = month;
  }

  get year(): number {
    return this.props.year;
  }

  set year(year: number) {
    this.props.year = year;
  }

  get priceInCents(): bigint {
    return this.props.priceInCents;
  }

  set priceInCents(priceInCents: bigint) {
    this.props.priceInCents = priceInCents;
  }

  get payments(): PaymentMensality[] {
    return this.props.payments ?? [];
  }

  get associates(): AssociateMensality[] {
    return this.props.associates ?? [];
  }
}
