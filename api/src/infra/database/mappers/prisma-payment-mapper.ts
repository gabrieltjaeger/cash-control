import { Payment } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";
import { PrismaAssociateMapper } from "@infra/database/mappers/prisma-associate-mapper";
import { PrismaPaymentMensalityMapper } from "@infra/database/mappers/prisma-payment-mensality-mapper";
import { Prisma } from "@prisma/client";

type PrismaPayment = Prisma.PaymentGetPayload<{}> & {
  associate?: Prisma.AssociateGetPayload<{}>;
  mensalities?: Prisma.PaymentMensalityGetPayload<{}>[];
};

export class PrismaPaymentMapper {
  static toEntity(raw: PrismaPayment): Payment {
    return Payment.create({
      id: new CUID(raw.id),
      associateId: new CUID(raw.associateId),
      ...(raw.associate && {
        associate: PrismaAssociateMapper.toEntity(raw.associate),
      }),
      ...(raw.mensalities && {
        mensalities: raw.mensalities.map((paymentMensality) =>
          PrismaPaymentMensalityMapper.toEntity(paymentMensality)
        ),
      }),
      date: raw.date,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id.value,
      associateId: payment.associateId.value,
      date: payment.date,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
