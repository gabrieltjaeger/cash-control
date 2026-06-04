import { prisma } from "@infra/database/prisma-client";

import { RepositoryQueryMode } from "@core/types/repository-query-mode";

import { Mensality } from "@core/entities/mensality";
import {
    MensalitiesRepository,
    MensalitiesRepositoryFilterOptions,
} from "@core/repositories/mensalities-repository";
import { PrismaMensalityMapper } from "@infra/database/mappers/prisma-mensality-mapper";

type MensalityFindManyArgs = NonNullable<
  Parameters<(typeof prisma.mensality)["findMany"]>[0]
>;
type MensalityWhereInput = MensalityFindManyArgs extends { where?: infer W }
  ? W
  : never;
type MensalityInclude = MensalityFindManyArgs extends { include?: infer I }
  ? I
  : never;
type MensalityWhereUniqueInput = Parameters<
  (typeof prisma.mensality)["findUnique"]
>[0]["where"];

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
    mode: RepositoryQueryMode,
    filters: MensalitiesRepositoryFilterOptions
  ): Promise<Mensality | null> {
    const include = this.buildInclude(mode);
    const whereUnique = this.buildUniqueWhere(filters);
    const where = this.buildWhere(filters);

    const mensality = whereUnique
      ? await prisma.mensality.findUnique({ where: whereUnique, include })
      : await prisma.mensality.findFirst({ where, include });

    return mensality
      ? PrismaMensalityMapper.toEntity(mensality, this.buildMapperOptions(mode))
      : null;
  }

  async list(
    mode: RepositoryQueryMode,
    filters: MensalitiesRepositoryFilterOptions,
    page?: number,
    take: number = 10
  ): Promise<Mensality[] & { next?: number | null; prev?: number | null }> {
    const include = this.buildInclude(mode);
    const where = this.buildWhere(filters);
    const mapperOptions = this.buildMapperOptions(mode);

    const [mensalities, count] = await Promise.all([
      prisma.mensality.findMany({
        where,
        ...(page && take && {
          skip: (page - 1) * take,
          take,
        }),
        include,
      }),
      prisma.mensality.count({ where }),
    ]);

    return Object.assign(
      mensalities.map((mensality) =>
        PrismaMensalityMapper.toEntity(mensality, mapperOptions)
      ),
      page && take
        ? {
            next: count > page * take ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        : {}
    );
  }

  private buildWhere(
    { id, month, year, associate }: MensalitiesRepositoryFilterOptions
  ): MensalityWhereInput {
    return {
      ...(id && { id }),
      ...(month && { month }),
      ...(typeof year !== "undefined" && { year }),
      ...(associate?.id && {
        associates: {
          some: {
            associateId: associate.id,
          },
        },
      }),
    };
  }

  private buildUniqueWhere(
    { id, month, year }: MensalitiesRepositoryFilterOptions
  ): MensalityWhereUniqueInput | null {
    if (id) return { id };
    if (month && typeof year === "number") {
      return { month_year: { month, year } };
    }

    return null;
  }

  private buildInclude(mode: RepositoryQueryMode): MensalityInclude | undefined {
    if (mode === "minimal") return undefined;

    const include: MensalityInclude = {
      payments: true,
    };

    if (mode === "deep") {
      include.associates = {
        include: {
          associate: true,
        },
      };
    }

    return include;
  }

  private buildMapperOptions(mode: RepositoryQueryMode) {
    return {
      includePayments: mode !== "minimal",
      includeAssociates: mode === "deep",
    } as const;
  }
}
