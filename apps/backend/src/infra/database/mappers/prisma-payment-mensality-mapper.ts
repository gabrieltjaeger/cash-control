import { PaymentMensality } from "@core/entities/payment-mensality";
import { PrismaMensalityMapper } from "@infra/database/mappers/prisma-mensality-mapper";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";

import { CUID } from "@core/entities/types/CUID";

import { Prisma } from "@prisma/client";

type PrismaPaymentMensality = Prisma.PaymentMensalityGetPayload<{}> & {
  payment?: Prisma.PaymentGetPayload<{}>;
  mensality?: Prisma.MensalityGetPayload<{}>;
};

export class PrismaPaymentMensalityMapper {
  static toEntity(raw: PrismaPaymentMensality): PaymentMensality {
    return PaymentMensality.create({
      paymentId: new CUID(raw.paymentId),
      mensalityId: new CUID(raw.mensalityId),
      ...(raw.payment && {
        payment: PrismaPaymentMapper.toEntity(raw.payment),
      }),
      ...(raw.mensality && {
        mensality: PrismaMensalityMapper.toEntity(raw.mensality),
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    paymentMensality: PaymentMensality
  ): Prisma.PaymentMensalityUncheckedCreateInput {
    return {
      paymentId: paymentMensality.paymentId.value,
      mensalityId: paymentMensality.mensalityId.value,
      createdAt: paymentMensality.createdAt,
      updatedAt: paymentMensality.updatedAt,
    };
  }
}
