import { Mensality } from "@core/entities/mensality";
import { CUID } from "@core/entities/types/CUID";
import { PrismaAssociateMensalityMapper } from "@infra/database/mappers/prisma-associate-mensality-mapper";
import { PrismaPaymentMensalityMapper } from "@infra/database/mappers/prisma-payment-mensality-mapper";
import { Prisma } from "@prisma/client";

type PrismaMensality = Prisma.MensalityGetPayload<{}> & {
  payments?: Prisma.PaymentMensalityGetPayload<{}>[];
  associates?: Prisma.AssociateMensalityGetPayload<{}>[];
};

interface MensalityMapperOptions {
  includePayments?: boolean;
  includeAssociates?: boolean;
}

export class PrismaMensalityMapper {
  static toEntity(
    raw: PrismaMensality,
    options: MensalityMapperOptions = {}
  ): Mensality {
    const { includePayments = false, includeAssociates = false } = options;

    return Mensality.create({
      id: new CUID(raw.id),
      month: raw.month,
      year: raw.year,
      priceInCents: raw.priceInCents,
      ...(includePayments &&
        raw.payments && {
          payments: raw.payments.map((paymentMensality) =>
            PrismaPaymentMensalityMapper.toEntity(paymentMensality)
          ),
        }),
      ...(includeAssociates &&
        raw.associates && {
          associates: raw.associates.map((associateMensality) =>
            PrismaAssociateMensalityMapper.toEntity(associateMensality)
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
