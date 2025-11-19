import { Associate } from "@core/entities/associate";

import {
  AssociatesRepository,
  AssociatesRepositoryFilterOptions,
} from "@core/repositories/associates-repository";

import { prisma } from "@infra/database/prisma-client";

import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaAssociateMapper } from "@infra/database/mappers/prisma-associate-mapper";

type AssociateFindManyArgs = NonNullable<
  Parameters<(typeof prisma.associate)["findMany"]>[0]
>;
type AssociateWhereInput = AssociateFindManyArgs extends { where?: infer W }
  ? W
  : never;
type AssociateInclude = AssociateFindManyArgs extends { include?: infer I }
  ? I
  : never;
type AssociateWhereUniqueInput = Parameters<(typeof prisma.associate)["findUnique"]>[0]["where"];

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
    filters: AssociatesRepositoryFilterOptions
  ): Promise<Associate | null> {
    const include = this.buildInclude(mode, filters.year);
    const whereUnique = this.buildUniqueWhere(filters);
    const where = this.buildWhere(filters);

    const associate = whereUnique
      ? await prisma.associate.findUnique({ where: whereUnique, include })
      : await prisma.associate.findFirst({ where, include });

    return associate ? PrismaAssociateMapper.toEntity(associate) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    filters: AssociatesRepositoryFilterOptions,
    page: number,
    take: number = 10
  ): Promise<Associate[] & { next?: number | null; prev?: number | null }> {
    const include = this.buildInclude(mode, filters.year);
    const where = this.buildWhere(filters);

    const [associates, count] = await Promise.all([
      prisma.associate.findMany({
        where,
        ...(!!page &&
          !!take && {
            skip: (page - 1) * take,
            take,
          }),
        include,
        orderBy: { fullName: "asc" },
      }),
      prisma.associate.count({ where }),
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

  private buildWhere(
    filters: AssociatesRepositoryFilterOptions
  ): AssociateWhereInput {
    const { id, email, phone, fullName, year } = filters;

    return {
      ...(id && { id }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(fullName && {
        fullName: { contains: fullName, mode: "insensitive" },
      }),
      ...(year && {
        mensalities: {
          some: {
            mensality: {
              year,
            },
          },
        },
      }),
    };
  }

  private buildUniqueWhere(
    filters: AssociatesRepositoryFilterOptions
  ): AssociateWhereUniqueInput | null {
    if (filters.id) return { id: filters.id };
    if (filters.email) return { email: filters.email };
    if (filters.phone) return { phone: filters.phone };
    return null;
  }

  private buildInclude(
    mode: RepositoryQueryMode,
    year?: number
  ): AssociateInclude | undefined {
    if (mode === "minimal") return undefined;

    const include: AssociateInclude = {
      address: true,
    };

    if (mode === "deep") {
      include.payments = {
        ...(year && {
          where: {
            mensalities: {
              some: {
                mensality: {
                  year,
                },
              },
            },
          },
        }),
        include: {
          associate: false,
          mensalities: {
            ...(year && {
              where: {
                mensality: {
                  year,
                },
              },
            }),
            include: {
              mensality: true,
            },
          },
        },
      };

      include.mensalities = {
        ...(year && {
          where: {
            mensality: {
              year,
            },
          },
        }),
        include: {
          mensality: true,
          associate: false,
        },
      };
    }

    return include;
  }
}
