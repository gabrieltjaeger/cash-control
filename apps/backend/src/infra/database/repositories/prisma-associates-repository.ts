import { Associate } from "@core/entities/associate";

import {
  AssociatesRepository,
  AssociatesRepositoryFilterOptions,
} from "@core/repositories/associates-repository";

import { prisma } from "@infra/database/prisma-client";

import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaAssociateMapper } from "@infra/database/mappers/prisma-associate-mapper";

export class PrismaAssociatesRepository implements AssociatesRepository {
  async create(associate: Associate): Promise<void> {
    await prisma.associate.create({
      data: PrismaAssociateMapper.toPersistence(associate),
    });
  }

  async update(associate: Associate): Promise<void> {
    await prisma.associate.update({
      where: { id: associate.id.value },
      data: PrismaAssociateMapper.toPersistence(associate),
    });
  }

  async find(
    mode: RepositoryQueryMode,
    { id, email, phone, year }: AssociatesRepositoryFilterOptions
  ): Promise<Associate | null> {
    const associate = await prisma.associate.findUnique({
      where: { id, email, phone },
      ...(mode === "deep" &&
        !!year && {
          include: {
            mensalities: {
              where: { mensality: { year } },
              include: {
                mensality: true,
              },
            },
          },
        }),
    });

    return associate ? PrismaAssociateMapper.toEntity(associate) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    { fullName, year }: AssociatesRepositoryFilterOptions,
    page: number,
    take: number = 10
  ): Promise<Associate[] & { next?: number | null; prev?: number | null }> {
    const [associates, count] = await Promise.all([
      prisma.associate.findMany({
        where: {
          fullName: { contains: fullName, mode: "insensitive" },
          ...(mode === "deep" &&
            !!year && {
              include: {
                payments: {
                  where: { mensalities: { some: { year } } },
                  include: {
                    mensalities: {
                      where: { year },
                    },
                  },
                },
              },
            }),
        },
        ...(!!page &&
          !!take && {
            skip: (page - 1) * take,
            take,
          }),
        include: { address: false },
        orderBy: { fullName: "asc" },
      }),
      prisma.associate.count({
        where: {
          fullName: { contains: fullName, mode: "insensitive" },
          ...(mode === "deep" &&
            !!year && {
              include: {
                payments: {
                  where: { mensalities: { some: { year } } },
                  include: {
                    mensalities: {
                      where: { year },
                    },
                  },
                },
              },
            }),
        },
      }),
    ]);

    return Object.assign(
      associates.map(PrismaAssociateMapper.toEntity),
      page && take
        ? {
            next: count > page * take ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        : {}
    );
  }

  async delete(associate: Associate): Promise<void> {
    await prisma.associate.delete({ where: { id: associate.id.value } });
  }
}
