import { prisma } from "@infra/database/prisma-client";

import { Payment } from "@core/entities/payment";
import {
    PaymentsRepository,
    PaymentsRepositoryFilterOptions,
} from "@core/repositories/payments-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";
import { PrismaPaymentMensalityMapper } from "../mappers/prisma-payment-mensality-mapper";

type PaymentFindManyArgs = NonNullable<
  Parameters<(typeof prisma.payment)["findMany"]>[0]
>;
type PaymentWhereInput = PaymentFindManyArgs extends { where?: infer W }
  ? W
  : never;
type PaymentInclude = PaymentFindManyArgs extends { include?: infer I }
  ? I
  : never;
type PaymentWhereUniqueInput = Parameters<
  (typeof prisma.payment)["findUnique"]
>[0]["where"];

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
      .catch((error: unknown) => {
        const prismaError = error as {
          code?: string;
          meta?: { modelName?: string };
        };

        if (
          prismaError?.code === "P2002" &&
          prismaError.meta?.modelName?.includes("AssociateMensality")
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
    mode: RepositoryQueryMode,
    filters: PaymentsRepositoryFilterOptions
  ): Promise<Payment | null> {
    const include = this.buildInclude(mode);
    const whereUnique = this.buildUniqueWhere(filters);
    const where = this.buildWhere(filters);

    const payment = whereUnique
      ? await prisma.payment.findUnique({ where: whereUnique, include })
      : await prisma.payment.findFirst({ where, include });

    return payment ? PrismaPaymentMapper.toEntity(payment) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    filters: PaymentsRepositoryFilterOptions,
    page?: number,
    take: number = 10
  ): Promise<Payment[] & { next?: number | null; prev?: number | null }> {
    const include = this.buildInclude(mode);
    const where = this.buildWhere(filters);

    const [payments, count] = await Promise.all([
      prisma.payment.findMany({
        where,
        ...(page && take && {
          skip: (page - 1) * take,
          take,
        }),
        include,
      }),
      prisma.payment.count({ where }),
    ]);

    return Object.assign(
      payments.map(PrismaPaymentMapper.toEntity),
      page && take
        ? {
            next: count > page * take ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        : {}
    );
  }

  private buildWhere(
    { id, date, since, until, associate, mensalities }: PaymentsRepositoryFilterOptions
  ): PaymentWhereInput {
    const dateFilter = {
      ...(date && { equals: date }),
      ...(since && { gte: since }),
      ...(until && { lte: until }),
    };

    return {
      ...(id && { id }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      ...(associate?.id && { associateId: associate.id }),
      ...(mensalities?.length && {
        mensalities: {
          some: {
            mensalityId: {
              in: mensalities.map((mensality) => mensality.id),
            },
          },
        },
      }),
    };
  }

  private buildUniqueWhere(
    { id }: PaymentsRepositoryFilterOptions
  ): PaymentWhereUniqueInput | null {
    if (id) return { id };
    return null;
  }

  private buildInclude(mode: RepositoryQueryMode): PaymentInclude | undefined {
    if (mode === "minimal") return undefined;

    const include: PaymentInclude = {
      associate: true,
    };

    if (mode === "deep") {
      include.mensalities = {
        include: {
          mensality: true,
        },
      };
    }

    return include;
  }
}
