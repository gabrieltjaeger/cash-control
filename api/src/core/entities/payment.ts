import { Associate } from "@core/entities/associate";
import { Entity, EntityRequest } from "@core/entities/entity";
import { Mensality } from "@core/entities/mensality";
import { CUID } from "@core/entities/types/CUID";

export interface PaymentProps extends EntityRequest {
  date: Date;

  associateId: CUID;
  associate?: Associate;

  paidMensalities?: Mensality[];
}

export class Payment extends Entity<PaymentProps> {
  static create(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get date(): Date {
    return this.props.date;
  }

  set date(date: Date) {
    this.props.date = date;
  }

  get associateId(): CUID {
    return this.props.associateId;
  }

  get associate(): Associate | null {
    return this.props.associate ?? null;
  }

  get paidMensalities(): Mensality[] | null {
    return this.props.paidMensalities ?? null;
  }
}
