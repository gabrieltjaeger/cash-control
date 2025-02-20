import { Address } from "@core/entities/address";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface AddressesRepositoryFilterOptions {
  id?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  associate?: { id: string };
}

export interface AddressesRepository {
  create(address: Address): Promise<void>;
  update(address: Address): Promise<void>;
  delete(address: Address): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: AddressesRepositoryFilterOptions
  ): Promise<Address | null>;
  list(
    mode: RepositoryQueryMode,
    filters: AddressesRepositoryFilterOptions,
    page?: number,
    take?: number
  ): Promise<Address[] & { next?: number | null; prev?: number | null }>;
}
