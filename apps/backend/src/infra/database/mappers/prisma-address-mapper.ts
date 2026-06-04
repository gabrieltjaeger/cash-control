import { Address } from "@core/entities/address";
import { CUID } from "@core/entities/types/CUID";
import { PrismaAssociateMapper } from "@infra/database/mappers/prisma-associate-mapper";
import { Prisma } from "@prisma/client";

type PrismaAddress = Prisma.AddressGetPayload<{}> & {
  associates?: Prisma.AssociateGetPayload<{}>[];
};

export class PrismaAddressMapper {
  static toEntity(raw: PrismaAddress): Address {
    return Address.create({
      id: new CUID(raw.id),
      street: raw.street,
      number: raw.number,
      complement: raw.complement,
      neighborhood: raw.neighborhood,
      city: raw.city,
      state: raw.state,
      country: raw.country,
      zipCode: raw.zipCode,
      ...(raw.associates && {
        associates: new Map(
          raw.associates.map((associate) => [
            associate.id,
            PrismaAssociateMapper.toEntity(associate),
          ])
        ),
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.value,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
