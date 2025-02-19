import { CUID } from "@core/entities/types/CUID";
import { User } from "@core/entities/user";
import { Prisma } from "@prisma/client";

type PrismaUser = Prisma.UserGetPayload<{}>;

export class PrismaUserMapper {
  static toEntity(raw: PrismaUser): User {
    return User.create({
      id: new CUID(raw.id),
      email: raw.email,
      password: raw.password,
      firstName: raw.firstName,
      lastName: raw.lastName,
      roles: raw.roles,
      active: raw.active,
      verifiedAt: raw.verifiedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.value,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      active: user.active,
      verifiedAt: user.verifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
