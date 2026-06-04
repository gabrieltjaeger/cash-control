import { Mensality } from "@core/entities/mensality";
import { CUID } from "@core/entities/types/CUID";
import { Prisma } from "@prisma/client";

type PrismaMensality = Prisma.MensalityGetPayload<{}>;

export class PrismaMensalityMapper {
  static toEntity(raw: PrismaMensality): Mensality {
    return Mensality.create({
      id: new CUID(raw.id),
      month: raw.month,
      year: raw.year,
      priceInCents: raw.priceInCents,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    mensality: Mensality
  ): Prisma.MensalityUncheckedCreateInput {
    return {
      id: mensality.id.value,
      month: mensality.month,
      year: mensality.year,
      priceInCents: mensality.priceInCents,
      createdAt: mensality.createdAt,
      updatedAt: mensality.updatedAt,
    };
  }
}
