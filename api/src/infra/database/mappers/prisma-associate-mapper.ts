import { Associate } from "@core/entities/associate";
import { CUID } from "@core/entities/types/CUID";
import { PrismaAddressMapper } from "@infra/database/mappers/prisma-address-mapper";
import { PrismaPaymentMapper } from "@infra/database/mappers/prisma-payment-mapper";
import { Prisma } from "@prisma/client";

type PrismaAssociate = Prisma.AssociateGetPayload<{}> & {
  address?: Prisma.AddressGetPayload<{}>;
  payments?: Prisma.PaymentGetPayload<{}>[];
};

export class PrismaAssociateMapper {
  static toEntity(raw: PrismaAssociate): Associate {
    return Associate.create({
      id: new CUID(raw.id),
      fullName: raw.fullName,
      email: raw.email,
      phone: raw.phone,
      addressId: raw.addressId ? new CUID(raw.addressId) : null,
      ...(raw.address && {
        address: PrismaAddressMapper.toEntity(raw.address),
      }),
      ...(raw.payments && {
        payments: new Map(
          raw.payments.map((payment) => [
            payment.id,
            PrismaPaymentMapper.toEntity(payment),
          ])
        ),
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    associate: Associate
  ): Prisma.AssociateUncheckedCreateInput {
    return {
      id: associate.id.value,
      fullName: associate.fullName,
      email: associate.email,
      phone: associate.phone,
      addressId: associate.addressId ? associate.addressId.value : null,
      createdAt: associate.createdAt,
      updatedAt: associate.updatedAt,
    };
  }
}
