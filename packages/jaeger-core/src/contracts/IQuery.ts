// @/application/contracts/IQuery.ts

/**
 * IQuery<TInput, TOutput> — Contrato base para Queries de Aplicação.
 *
 * CATEGORIA SEMÂNTICA:
 *   Queries NÃO são Repositories. Não compartilham hierarquia, não
 *   compartilham vocabulário, não compartilham diretório. Uma Query
 *   é uma consulta otimizada de leitura cujo retorno é um DTO achatado,
 *   projetado para um caso de uso de leitura específico (uma tela,
 *   um endpoint, um relatório).
 *
 * REGRAS:
 *   - TOutput NUNCA é um AggregateRoot.
 *   - TOutput NUNCA importa de @/domain/.
 *   - Implementações vivem em @/infrastructure/, não em
 *     @/infrastructure/persistence/repositories/.
 *   - Cada caso de uso de leitura tem sua própria Query. Não
 *     compartilhe DTOs entre telas "porque parecem iguais" — elas
 *     evoluem em frequências diferentes.
 *
 * REGRA JAEGER FORGE:
 *   QueryMustNotReturnAggregateRule (fatal)
 *   QueryMustNotImportFromDomainRule (fatal)
 */
export interface IQuery<TInput, TOutput> {
    execute(input: TInput): Promise<TOutput>;
}
