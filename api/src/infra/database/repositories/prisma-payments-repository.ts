import { prisma } from "@infra/database/prisma-client";

import { Payment } from "@core/entities/payment";
import {
  PaymentsRepository,
  PaymentsRepositoryFilterOptions,
} from "@core/repositories/payments-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";
import { PrismaPaymentMensalityMapper } from "../mappers/prisma-payment-mensality-mapper";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async create(payment: Payment): Promise<void> {
    await prisma
      .$transaction([
        prisma.payment.create({
          data: PrismaPaymentMapper.toPersistence(payment),
        }),
        prisma.paymentMensality.createMany({
          data: payment.mensalities.map((paymentMensality) =>
            PrismaPaymentMensalityMapper.toPersistence(paymentMensality)
          ),
        }),
        prisma.associateMensality.createMany({
          data: payment.mensalities.map((paymentMensality) => ({
            associateId: payment.associateId.value,
            mensalityId: paymentMensality.mensalityId.value,
          })),
        }),
      ])
      .catch((error) => {
        if (
          error.code === "P2002" &&
          error.meta.modelName.includes("AssociateMensality")
        )
          throw new Error(
            "The associate has already paid for a mensality in this request"
          );

        throw error;
      });
  }

  async update(payment: Payment): Promise<void> {
    await prisma.payment.update({
      where: { id: payment.id.value },
      data: PrismaPaymentMapper.toPersistence(payment),
    });
  }

  async delete(payment: Payment): Promise<void> {
    await prisma.$transaction([
      prisma.associateMensality.deleteMany({
        where: {
          mensality: { payments: { every: { paymentId: payment.id.value } } },
        },
      }),
      prisma.paymentMensality.deleteMany({
        where: { paymentId: payment.id.value },
      }),
      prisma.payment.delete({ where: { id: payment.id.value } }),
    ]);
  }

  async find(
    _: RepositoryQueryMode,
    { id, date, associate }: PaymentsRepositoryFilterOptions
  ): Promise<Payment | null> {
    const payment = await prisma.payment.findUnique({
      where: { id, date, associateId: associate?.id },
      include: { associate: true },
    });

    return payment ? PrismaPaymentMapper.toEntity(payment) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    { since, until, page = 1, take = 10 }: PaymentsRepositoryFilterOptions
  ): Promise<Payment[] & { next?: number | null; prev?: number | null }> {
    const [payments, count] = await Promise.all([
      prisma.payment.findMany({
        where: {
          date: {
            ...(!!since && { gte: since }),
            ...(!!until && { lte: until }),
          },
        },
        skip: (page - 1) * take,
        take,
        include: {
          ...(mode === "expanded" && { associate: true }),
          ...(mode === "deep" && { associate: true, mensalities: true }),
        },
      }),
      prisma.payment.count(),
    ]);

    return Object.assign(payments.map(PrismaPaymentMapper.toEntity), {
      next: count > page * take ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    });
  }
}
