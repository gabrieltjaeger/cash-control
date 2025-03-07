import { Associate } from "@core/entities/associate";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface AssociatesRepositoryFilterOptions {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  year?: number;
  page?: number;
  take?: number;
}

export interface AssociatesRepository {
  create(associate: Associate): Promise<void>;
  update(associate: Associate): Promise<void>;
  delete(associate: Associate): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: AssociatesRepositoryFilterOptions
  ): Promise<Associate | null>;
  list(
    mode: RepositoryQueryMode,
    filters: AssociatesRepositoryFilterOptions,
    page: number,
    take?: number
  ): Promise<Associate[] & { next?: number | null; prev?: number | null }>;
}
