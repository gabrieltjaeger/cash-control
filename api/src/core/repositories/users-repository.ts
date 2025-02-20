import { Role, User } from "@core/entities/user";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface UsersRepositoryFilterOptions {
  id?: string;
  email?: string;
  roles?: Role[];
  active?: boolean;
}

export interface UsersRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: UsersRepositoryFilterOptions
  ): Promise<User | null>;
  list(
    mode: RepositoryQueryMode,
    filters: UsersRepositoryFilterOptions,
    page?: number,
    take?: number
  ): Promise<User[] & { next?: number | null; prev?: number | null }>;
}
