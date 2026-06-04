import { Session } from "@core/entities/session";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface SessionsRepositoryFilterOptions {
  ipAddress?: string;
  userAgent?: string;
  since?: Date;
  user?: { id: string };
}

export interface SessionsRepository {
  create(session: Session): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: SessionsRepositoryFilterOptions
  ): Promise<Session | null>;
}
