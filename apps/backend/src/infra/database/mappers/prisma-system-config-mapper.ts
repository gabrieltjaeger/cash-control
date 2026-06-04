import { SystemConfig } from "@core/entities/system-config";
import { CUID } from "@core/entities/types/CUID";
import { Prisma } from "@prisma/client";

type PrismaSystemConfig = Prisma.SystemConfigGetPayload<{}>;

export class PrismaSystemConfigMapper {
  static toEntity(raw: PrismaSystemConfig): SystemConfig {
    return SystemConfig.create({
      id: new CUID(raw.id),
      key: raw.key,
      value: raw.value,
      valueType: raw.valueType,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    systemConfig: SystemConfig
  ): Prisma.SystemConfigUncheckedCreateInput {
    return {
      id: systemConfig.id.value,
      key: systemConfig.key,
      value: systemConfig.value,
      valueType: systemConfig.value,
      createdAt: systemConfig.createdAt,
      updatedAt: systemConfig.updatedAt,
    };
  }
}
