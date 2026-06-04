import { User } from "@core/entities/user";
import {
  UsersRepository,
  UsersRepositoryFilterOptions,
} from "@core/repositories/users-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaUserMapper } from "@infra/database/mappers/prisma-user-mapper";
import { prisma } from "@infra/database/prisma-client";

type UserFindManyArgs = NonNullable<
  Parameters<(typeof prisma.user)["findMany"]>[0]
>;
type UserWhereInput = UserFindManyArgs extends { where?: infer W }
  ? W
  : never;
type UserWhereUniqueInput = Parameters<(typeof prisma.user)["findUnique"]>[0]["where"];

export class PrismaUsersRepository implements UsersRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: PrismaUserMapper.toPersistence(user),
    });
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id.value },
      data: PrismaUserMapper.toPersistence(user),
    });
  }

  async find(
    _: RepositoryQueryMode,
    filters: UsersRepositoryFilterOptions
  ): Promise<User | null> {
    const whereUnique = this.buildUniqueWhere(filters);
    const where = this.buildWhere(filters);

    const user = whereUnique
      ? await prisma.user.findUnique({ where: whereUnique })
      : await prisma.user.findFirst({ where });

    return user ? PrismaUserMapper.toEntity(user) : null;
  }

  async list(
    _: RepositoryQueryMode,
    filters: UsersRepositoryFilterOptions,
    page?: number,
    take: number = 10
  ): Promise<User[] & { next?: number | null; prev?: number | null }> {
    const where = this.buildWhere(filters);

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
        ...(page && take && {
          skip: (page - 1) * take,
          take,
        }),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return Object.assign(
      users.map(PrismaUserMapper.toEntity),
      page && take
        ? {
            next: count > page * take ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        : {}
    );
  }

  private buildWhere(
    { id, email, roles, active }: UsersRepositoryFilterOptions
  ): UserWhereInput {
    return {
      ...(id && { id }),
      ...(email && { email }),
      ...(roles?.length && {
        roles: {
          hasSome: roles,
        },
      }),
      ...(
        typeof active === "boolean" && {
          active,
        }
      ),
    };
  }

  private buildUniqueWhere(
    { id, email }: UsersRepositoryFilterOptions
  ): UserWhereUniqueInput | null {
    if (id) return { id };
    if (email) return { email };
    return null;
  }
}
