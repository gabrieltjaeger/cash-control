import { prisma } from "@infra/database/prisma-client";

import { Payment } from "@core/entities/payment";
import {
  PaymentsRepository,
  PaymentsRepositoryFilterOptions,
} from "@core/repositories/payments-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async create(payment: Payment): Promise<void> {
    await prisma.payment.create({
      data: PrismaPaymentMapper.toPersistence(payment),
    });
  }

  async update(payment: Payment): Promise<void> {
    await prisma.payment.update({
      where: { id: payment.id.value },
      data: PrismaPaymentMapper.toPersistence(payment),
    });
  }

  async delete(payment: Payment): Promise<void> {
    await prisma.payment.delete({ where: { id: payment.id.value } });
  }

  async find(
    _: RepositoryQueryMode,
    { id, date, associate }: PaymentsRepositoryFilterOptions
  ): Promise<Payment | null> {
    const payment = await prisma.payment.findUnique({
      where: { id, date, associateId: associate?.id },
      include: { associate: true, paidMensalities: true },
    });

    return payment ? PrismaPaymentMapper.toEntity(payment) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    { page = 1, take = 10 }: PaymentsRepositoryFilterOptions
  ): Promise<Payment[] & { next?: number | null; prev?: number | null }> {
    const [payments, count] = await Promise.all([
      prisma.payment.findMany({
        skip: (page - 1) * take,
        take,
        include: {
          ...(mode === "expanded" && { associate: true }),
          ...(mode === "deep" && { associate: true, paidMensalities: true }),
        },
      }),
      prisma.payment.count(),
    ]);

    const payment = payments[0].associate;

    return Object.assign(payments.map(PrismaPaymentMapper.toEntity), {
      next: count > page * take ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    });
  }
}
