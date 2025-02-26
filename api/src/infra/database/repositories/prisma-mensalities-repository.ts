import { prisma } from "@infra/database/prisma-client";

import { RepositoryQueryMode } from "@core/types/repository-query-mode";

import { Mensality } from "@core/entities/mensality";
import {
  MensalitiesRepository,
  MensalitiesRepositoryFilterOptions,
} from "@core/repositories/mensalities-repository";
import { PrismaMensalityMapper } from "@infra/database/mappers/prisma-mensality-mapper";

export class PrismaMensalitiesRepository implements MensalitiesRepository {
  async create(mensality: Mensality): Promise<void> {
    await prisma.mensality.create({
      data: PrismaMensalityMapper.toPersistence(mensality),
    });
  }

  async update(mensality: Mensality): Promise<void> {
    await prisma.mensality.update({
      where: { id: mensality.id.value },
      data: PrismaMensalityMapper.toPersistence(mensality),
    });
  }

  async delete(mensality: Mensality): Promise<void> {
    await prisma.mensality.delete({ where: { id: mensality.id.value } });
  }

  async find(
    _: RepositoryQueryMode,
    { id, month, year, associate }: MensalitiesRepositoryFilterOptions
  ): Promise<Mensality | null> {
    const mensality = await prisma.mensality.findUnique({
      where: {
        id,
        payments: { some: { associateId: associate?.id } },
        ...(month && year && { month_year: { month, year } }),
      },
      include: { payments: true },
    });

    return mensality ? PrismaMensalityMapper.toEntity(mensality) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    { page = 1, take = 10, year }: MensalitiesRepositoryFilterOptions
  ): Promise<Mensality[] & { next?: number | null; prev?: number | null }> {
    const [mensalities, count] = await Promise.all([
      prisma.mensality.findMany({
        ...(year && { where: { year } }),
        skip: (page - 1) * take,
        take,

        include: {
          ...(mode === "expanded" && { payments: true }),
          ...(mode === "deep" && {
            payments: { include: { associate: true } },
          }),
        },
      }),
      prisma.mensality.count(),
    ]);

    return Object.assign(mensalities.map(PrismaMensalityMapper.toEntity), {
      next: count > page * take ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    });
  }
}
