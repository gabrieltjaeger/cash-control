import { Entity, EntityRequest } from "@core/entities/entity";
import { CUID } from "@core/entities/types/CUID";

import { Associate } from "@core/entities/associate";
import { Mensality } from "@core/entities/mensality";

export interface AssociateMensalityProps extends EntityRequest {
  associateId: CUID;
  mensalityId: CUID;

  associate?: Associate;
  mensality?: Mensality;
}

export class AssociateMensality extends Entity<AssociateMensalityProps> {
  static create(props: AssociateMensalityProps): AssociateMensality {
    return new AssociateMensality(props);
  }

  get associateId(): CUID {
    return this.props.associateId;
  }

  get mensalityId(): CUID {
    return this.props.mensalityId;
  }

  get associate(): Associate | null {
    return this.props.associate ?? null;
  }

  get mensality(): Mensality | null {
    return this.props.mensality ?? null;
  }
}
