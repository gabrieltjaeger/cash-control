import { Session } from "@core/entities/session";
import { CUID } from "@core/entities/types/CUID";
import { PrismaUserMapper } from "@infra/database/mappers/prisma-user-mapper";
import { Prisma } from "@prisma/client";

type PrismaSession = Prisma.SessionGetPayload<{}> & {
  user?: Prisma.UserGetPayload<{}>;
};

export class PrismaSessionMapper {
  static toEntity(raw: PrismaSession): Session {
    return Session.create({
      id: new CUID(raw.id),
      ipAddress: raw.ipAddress,
      userAgent: raw.userAgent,
      userId: new CUID(raw.userId),
      ...(raw.user && {
        user: PrismaUserMapper.toEntity(raw.user),
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.value,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      userId: session.userId.value,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
