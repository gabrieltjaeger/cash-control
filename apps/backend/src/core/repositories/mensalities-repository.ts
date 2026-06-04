import { Mensality, Month } from "@core/entities/mensality";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface MensalitiesRepositoryFilterOptions {
  id?: string;
  month?: Month;
  year?: number;
  associate?: { id: string };
  page?: number;
  take?: number;
}

export interface MensalitiesRepository {
  create(mensality: Mensality): Promise<void>;
  update(mensality: Mensality): Promise<void>;
  delete(mensality: Mensality): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: MensalitiesRepositoryFilterOptions
  ): Promise<Mensality | null>;
  list(
    mode: RepositoryQueryMode,
    filters: MensalitiesRepositoryFilterOptions,
    page?: number,
    take?: number
  ): Promise<Mensality[] & { next?: number | null; prev?: number | null }>;
}
