import { Address } from "@core/entities/address";
import {
  AddressesRepository,
  AddressesRepositoryFilterOptions,
} from "@core/repositories/addresses-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaAddressMapper } from "@infra/database/mappers/prisma-address-mapper";
import { prisma } from "@infra/database/prisma-client";

type AddressFindManyArgs = NonNullable<
  Parameters<(typeof prisma.address)["findMany"]>[0]
>;
type AddressWhereInput = AddressFindManyArgs extends { where?: infer W }
  ? W
  : never;
type AddressInclude = AddressFindManyArgs extends { include?: infer I }
  ? I
  : never;
type AddressWhereUniqueInput = Parameters<
  (typeof prisma.address)["findUnique"]
>[0]["where"];

export class PrismaAddressesRepository implements AddressesRepository {
  async create(address: Address): Promise<void> {
    await prisma.address.create({
      data: PrismaAddressMapper.toPersistence(address),
    });
  }

  async update(address: Address): Promise<void> {
    await prisma.address.update({
      where: { id: address.id.value },
      data: PrismaAddressMapper.toPersistence(address),
    });
  }

  async delete(address: Address): Promise<void> {
    await prisma.address.delete({ where: { id: address.id.value } });
  }

  async find(
    mode: RepositoryQueryMode,
    filters: AddressesRepositoryFilterOptions
  ): Promise<Address | null> {
    const include = this.buildInclude(mode);
    const whereUnique = this.buildUniqueWhere(filters);
    const where = this.buildWhere(filters);

    const address = whereUnique
      ? await prisma.address.findUnique({ where: whereUnique, include })
      : await prisma.address.findFirst({ where, include });

    return address ? PrismaAddressMapper.toEntity(address) : null;
  }

  async list(
    mode: RepositoryQueryMode,
    filters: AddressesRepositoryFilterOptions,
    page?: number,
    take: number = 10
  ): Promise<Address[] & { next?: number | null; prev?: number | null }> {
    const include = this.buildInclude(mode);
    const where = this.buildWhere(filters);

    const [addresses, count] = await Promise.all([
      prisma.address.findMany({
        where,
        ...(page && take && {
          skip: (page - 1) * take,
          take,
        }),
        include,
        orderBy: { createdAt: "desc" },
      }),
      prisma.address.count({ where }),
    ]);

    return Object.assign(
      addresses.map(PrismaAddressMapper.toEntity),
      page && take
        ? {
            next: count > page * take ? page + 1 : null,
            prev: page > 1 ? page - 1 : null,
          }
        : {}
    );
  }

  private buildWhere(
    { id, street, city, state, zip, associate }: AddressesRepositoryFilterOptions
  ): AddressWhereInput {
    return {
      ...(id && { id }),
      ...(street && {
        street: { contains: street, mode: "insensitive" },
      }),
      ...(city && {
        city: { contains: city, mode: "insensitive" },
      }),
      ...(state && {
        state: { contains: state, mode: "insensitive" },
      }),
      ...(zip && { zipCode: zip }),
      ...(associate?.id && {
        associates: {
          some: {
            id: associate.id,
          },
        },
      }),
    };
  }

  private buildUniqueWhere(
    { id }: AddressesRepositoryFilterOptions
  ): AddressWhereUniqueInput | null {
    if (id) return { id };
    return null;
  }

  private buildInclude(
    mode: RepositoryQueryMode
  ): AddressInclude | undefined {
    if (mode === "minimal") return undefined;

    return {
      associates: true,
    } as AddressInclude;
  }
}
