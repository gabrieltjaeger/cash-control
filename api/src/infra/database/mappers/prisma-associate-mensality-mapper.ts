import { AssociateMensality } from "@core/entities/associate-mensality";
import { PrismaMensalityMapper } from "@infra/database/mappers/prisma-mensality-mapper";

import { CUID } from "@core/entities/types/CUID";

import { Prisma } from "@prisma/client";

type PrismaAssociateMensality = Prisma.AssociateMensalityGetPayload<{}> & {
  mensality?: Prisma.MensalityGetPayload<{}>;
};

export class PrismaAssociateMensalityMapper {
  static toEntity(raw: PrismaAssociateMensality): AssociateMensality {
    return AssociateMensality.create({
      associateId: new CUID(raw.associateId),
      mensalityId: new CUID(raw.mensalityId),
      ...(raw.mensality && {
        mensality: PrismaMensalityMapper.toEntity(raw.mensality),
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    associateMensality: AssociateMensality
  ): Prisma.AssociateMensalityUncheckedCreateInput {
    return {
      associateId: associateMensality.associateId.value,
      mensalityId: associateMensality.mensalityId.value,
      createdAt: associateMensality.createdAt,
      updatedAt: associateMensality.updatedAt,
    };
  }
}
