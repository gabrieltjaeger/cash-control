import { Payment } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";
import { Prisma } from "@prisma/client";
import { PrismaAssociateMapper } from "./prisma-associate-mapper";
import { PrismaMensalityMapper } from "./prisma-mensality-mapper";

type PrismaPayment = Prisma.PaymentGetPayload<{}> & {
  associate?: Prisma.AssociateGetPayload<{}>;
  paidMensalities?: Prisma.MensalityGetPayload<{}>[];
};

export class PrismaPaymentMapper {
  static toEntity(raw: PrismaPayment): Payment {
    return Payment.create({
      id: new CUID(raw.id),
      associateId: new CUID(raw.associateId),
      ...(raw.associate && {
        associate: PrismaAssociateMapper.toEntity(raw.associate),
      }),
      ...(raw.paidMensalities && {
        paidMensalities: new Map(
          raw.paidMensalities.map((mensality) => [
            mensality.id,
            PrismaMensalityMapper.toEntity(mensality),
          ])
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
