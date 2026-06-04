import { Entity, EntityRequest } from "@core/entities/entity";
import { CUID } from "@core/entities/types/CUID";

import { Mensality } from "@core/entities/mensality";
import { Payment } from "@core/entities/payment";

export interface PaymentMensalityProps extends EntityRequest {
  paymentId: CUID;
  mensalityId: CUID;

  payment?: Payment;
  mensality?: Mensality;
}

export class PaymentMensality extends Entity<PaymentMensalityProps> {
  static create(props: PaymentMensalityProps): PaymentMensality {
    return new PaymentMensality(props);
  }

  get paymentId(): CUID {
    return this.props.paymentId;
  }

  get mensalityId(): CUID {
    return this.props.mensalityId;
  }

  get payment(): Payment | null {
    return this.props.payment ?? null;
  }

  get mensality(): Mensality | null {
    return this.props.mensality ?? null;
  }
}
