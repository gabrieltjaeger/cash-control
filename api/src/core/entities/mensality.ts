import { Entity, EntityRequest } from "@core/entities/entity";
import { Payment } from "@core/entities/payment";

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

  payments?: Map<string, Payment>;
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

  get priceInCents(): BigInt {
    return this.props.priceInCents;
  }

  set priceInCents(priceInCents: bigint) {
    this.props.priceInCents = priceInCents;
  }

  get payments(): Map<string, Payment> {
    return this.props.payments ?? new Map<string, Payment>();
  }

  set payments(payments: Map<string, Payment>) {
    this.props.payments = payments;
  }
}
