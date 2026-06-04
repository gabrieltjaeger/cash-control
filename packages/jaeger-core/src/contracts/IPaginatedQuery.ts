import { IQuery } from "./IQuery.js";

/**
 * PaginationInput — Forma mínima de entrada para queries paginadas.
 *
 * Toda query paginada DEVE estender esta interface no seu Input.
 * Campos adicionais (filtros, ordenação) são livres.
 */
export interface PaginationInput {
    readonly limit: number;
    readonly cursor?: string;
}

/**
 * PaginatedResult<T> — Forma canônica de retorno paginado.
 *
 * Imutável por contrato. `nextCursor: null` sinaliza fim da paginação.
 */
export interface PaginatedResult<TItem> {
    readonly items: ReadonlyArray<TItem>;
    readonly nextCursor: string | null;
}

/**
 * IPaginatedQuery<TInput, TItem> — Refinamento de IQuery para listagens.
 *
 * CONSTRAINTS:
 *   - TInput DEVE estender PaginationInput (limit obrigatório, cursor opcional).
 *   - O retorno é SEMPRE PaginatedResult<TItem>.
 *
 * USO:
 *   interface IListProfilesQuery extends IPaginatedQuery
 *     ListProfilesInput,    // estende PaginationInput, adiciona teamId?: string
 *     ProfileSummaryDTO
 *   > {}
 */
export interface IPaginatedQuery<
    TInput extends PaginationInput,
    TItem,
> extends IQuery<TInput, PaginatedResult<TItem>> {}
