import { SystemConfig } from "@core/entities/system-config";
import {
	SystemConfigsRepository,
	SystemConfigsRepositoryFilterOptions,
} from "@core/repositories/system-configs-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaSystemConfigMapper } from "@infra/database/mappers/prisma-system-config-mapper";
import { prisma } from "@infra/database/prisma-client";

type SystemConfigFindManyArgs = NonNullable<
	Parameters<(typeof prisma.systemConfig)["findMany"]>[0]
>;
type SystemConfigWhereInput = SystemConfigFindManyArgs extends { where?: infer W }
	? W
	: never;
type SystemConfigWhereUniqueInput = Parameters<
	(typeof prisma.systemConfig)["findUnique"]
>[0]["where"];

export class PrismaSystemConfigsRepository
	implements SystemConfigsRepository
{
	async create(systemConfig: SystemConfig): Promise<void> {
		await prisma.systemConfig.create({
			data: PrismaSystemConfigMapper.toPersistence(systemConfig),
		});
	}

	async update(systemConfig: SystemConfig): Promise<void> {
		await prisma.systemConfig.update({
			where: { id: systemConfig.id.value },
			data: PrismaSystemConfigMapper.toPersistence(systemConfig),
		});
	}

	async find(
		_: RepositoryQueryMode,
		filters: SystemConfigsRepositoryFilterOptions
	): Promise<SystemConfig | null> {
		const whereUnique = this.buildUniqueWhere(filters);
		const where = this.buildWhere(filters);

		const systemConfig = whereUnique
			? await prisma.systemConfig.findUnique({ where: whereUnique })
			: await prisma.systemConfig.findFirst({ where });

		return systemConfig
			? PrismaSystemConfigMapper.toEntity(systemConfig)
			: null;
	}

	async list(
		_: RepositoryQueryMode,
		filters: SystemConfigsRepositoryFilterOptions,
			page?: number,
		take: number = 10
	): Promise<SystemConfig[] & { next?: number | null; prev?: number | null }> {
		const where = this.buildWhere(filters);

		const [configs, count] = await Promise.all([
					prisma.systemConfig.findMany({
						where,
						...(page && take && {
							skip: (page - 1) * take,
							take,
						}),
						orderBy: { createdAt: "desc" },
					}),
			prisma.systemConfig.count({ where }),
		]);

				return Object.assign(
					configs.map(PrismaSystemConfigMapper.toEntity),
					page && take
						? {
								next: count > page * take ? page + 1 : null,
								prev: page > 1 ? page - 1 : null,
							}
						: {}
				);
	}

	private buildWhere(
		{ key, value, valueType }: SystemConfigsRepositoryFilterOptions
	): SystemConfigWhereInput {
		return {
			...(key && {
				key: { contains: key, mode: "insensitive" },
			}),
			...(value && {
				value: { contains: value, mode: "insensitive" },
			}),
			...(valueType && { valueType }),
		};
	}

	private buildUniqueWhere(
		{ key }: SystemConfigsRepositoryFilterOptions
	): SystemConfigWhereUniqueInput | null {
		if (key) return { key };
		return null;
	}
}
