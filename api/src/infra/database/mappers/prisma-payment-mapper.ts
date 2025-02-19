import { Payment } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";
import { Prisma } from "@prisma/client";

type PrismaPayment = Prisma.PaymentGetPayload<{}> & {
  associate?: Prisma.AssociateGetPayload<{}>;
};

export class PrismaPaymentMapper {
  static toEntity(raw: PrismaPayment): Payment {
    return Payment.create({
      id: new CUID(raw.id),
      associateId: new CUID(raw.associateId),
      ...(raw.associate && {
        associate: PrismaAssociateMapper.toEntity(raw.associate),
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
