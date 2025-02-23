import { Payment } from "@core/entities/payment";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export interface PaymentsRepositoryFilterOptions {
  id?: string;
  date?: Date;
  since?: Date;
  until?: Date;
  associate?: { id: string };
  paidMensalities?: { id: string }[];
  page?: number;
  take?: number;
}

export interface PaymentsRepository {
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  delete(payment: Payment): Promise<void>;
  find(
    mode: RepositoryQueryMode,
    filters: PaymentsRepositoryFilterOptions
  ): Promise<Payment | null>;
  list(
    mode: RepositoryQueryMode,
    filters: PaymentsRepositoryFilterOptions,
    page?: number,
    take?: number
  ): Promise<Payment[] & { next?: number | null; prev?: number | null }>;
}
