import { SystemConfig } from "@core/entities/system-config";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface SystemConfigsRepositoryFilterOptions {
  key?: string;
  value?: string;
  valueType?: string;
}

export interface SystemConfigsRepository {
  create(systemConfig: SystemConfig): Promise<void>;
  update(systemConfig: SystemConfig): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: SystemConfigsRepositoryFilterOptions
  ): Promise<SystemConfig | null>;
  list(
    mode: RepositoryQueryMode,
    filters: SystemConfigsRepositoryFilterOptions,
    page?: number,
    take?: number
  ): Promise<SystemConfig[] & { next?: number | null; prev?: number | null }>;
}
