import { Session } from "@core/entities/session";
import {
	SessionsRepository,
	SessionsRepositoryFilterOptions,
} from "@core/repositories/sessions-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";
import { PrismaSessionMapper } from "@infra/database/mappers/prisma-session-mapper";
import { prisma } from "@infra/database/prisma-client";

type SessionFindManyArgs = NonNullable<
	Parameters<(typeof prisma.session)["findMany"]>[0]
>;
type SessionWhereInput = SessionFindManyArgs extends { where?: infer W }
	? W
	: never;
type SessionInclude = SessionFindManyArgs extends { include?: infer I }
	? I
	: never;

export class PrismaSessionsRepository implements SessionsRepository {
	async create(session: Session): Promise<void> {
		await prisma.session.create({
			data: PrismaSessionMapper.toPersistence(session),
		});
	}

	async find(
		mode: RepositoryQueryMode,
		filters: SessionsRepositoryFilterOptions
	): Promise<Session | null> {
		const include = this.buildInclude(mode);
		const where = this.buildWhere(filters);

			if (!this.hasFilters(where)) return null;

		const session = await prisma.session.findFirst({ where, include });

		return session ? PrismaSessionMapper.toEntity(session) : null;
	}

	private buildWhere(
		{ ipAddress, userAgent, since, user }: SessionsRepositoryFilterOptions
	): SessionWhereInput {
		return {
			...(ipAddress && { ipAddress }),
			...(userAgent && { userAgent }),
			...(since && {
				createdAt: {
					gte: since,
				},
			}),
			...(user?.id && { userId: user.id }),
		};
	}

	private buildInclude(mode: RepositoryQueryMode): SessionInclude | undefined {
		if (mode === "minimal") return undefined;

		return {
			user: true,
		} as SessionInclude;
	}

		private hasFilters(where: SessionWhereInput): boolean {
			return Object.keys(where ?? {}).length > 0;
		}
}
