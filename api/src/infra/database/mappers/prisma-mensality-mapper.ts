import { Mensality } from "@core/entities/mensality";
import { CUID } from "@core/entities/types/CUID";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";
import { Prisma } from "@prisma/client";

type PrismaMensality = Prisma.MensalityGetPayload<{}> & {
  payments?: Prisma.PaymentGetPayload<{}>[];
};

export class PrismaMensalityMapper {
  static toEntity(raw: PrismaMensality): Mensality {
    return Mensality.create({
      id: new CUID(raw.id),
      month: raw.month,
      year: raw.year,
      priceInCents: raw.priceInCents,
      ...(raw.payments && {
        payments: new Map(
          raw.payments.map((payment) => [
            payment.id,
            PrismaPaymentMapper.toEntity(payment),
          ])
        ),
      }),
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
