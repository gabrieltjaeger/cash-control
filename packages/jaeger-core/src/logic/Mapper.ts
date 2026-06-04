import type { AggregateRoot } from "../domain/AggregateRoot.js";

/**
 * Mapper<TAggregate, TRow, TDTO> — Protocolo de mapeamento entre camadas.
 *
 * RESPONSABILIDADE:
 *   Um Mapper é o único componente autorizado a conhecer simultaneamente:
 *     - A entidade de domínio (TAggregate, em /core)
 *     - O schema de persistência (TRow, definido pelo ORM em /infra/database)
 *     - O DTO de apresentação (TDTO, entregue ao frontend ou outros serviços)
 *
 *   Essa autorização exclusiva é validada pelo motor Jaeger Forge:
 *   MapperIsTheOnlyDualImporterRule — qualquer outro arquivo que importe
 *   tanto /core quanto schemas de /infra é uma violação fatal.
 *
 * TRÊS DIREÇÕES:
 *   toDomain    → Row do banco     → Aggregate rico com comportamento
 *   toPersistence → Aggregate       → Row plano para o ORM
 *   toDTO       → Aggregate         → DTO serializável para o frontend
 *
 * REGRAS:
 *   - toDomain usa sempre `Aggregate.reconstitute()`, nunca `new` direto.
 *   - toPersistence faz flattening de Value Objects em colunas.
 *   - toDTO nunca expõe referências à instância do Aggregate (retorna objeto novo).
 *   - Value Objects são reconstituídos em toDomain antes de injetar na entidade.
 *
 * LOCALIZAÇÃO: /infra/database/mappers/{Nome}Mapper.ts de cada módulo.
 *
 * EXEMPLO:
 *
 *   export class ProfileMapper
 *     extends Mapper<ProfileAggregate, ProfileRow, ProfileDTO>
 *   {
 *     toDomain(row: ProfileRow): ProfileAggregate {
 *       return ProfileAggregate.reconstitute({
 *         id: row.id,
 *         email: Email.reconstitute(row.email),
 *         name: ProfileName.reconstitute(row.name),
 *         version: row.version,
 *         createdAt: row.created_at,
 *         updatedAt: row.updated_at,
 *       });
 *     }
 *
 *     toPersistence(aggregate: ProfileAggregate): ProfileRow {
 *       return {
 *         id: aggregate.id,
 *         email: aggregate.email.value,   // flattening do VO
 *         name: aggregate.name.value,
 *         version: aggregate.version,
 *         created_at: aggregate.createdAt,
 *         updated_at: aggregate.updatedAt,
 *       };
 *     }
 *
 *     toDTO(aggregate: ProfileAggregate): ProfileDTO {
 *       return {
 *         id: aggregate.id,
 *         email: aggregate.email.value,
 *         name: aggregate.name.value,
 *       };
 *     }
 *   }
 */
export abstract class Mapper<
    TAggregate extends AggregateRoot,
    TRow,
    TDTO = Record<string, unknown>,
> {
    /**
     * Converte um registro do banco em um Aggregate rico.
     * DEVE usar TAggregate.reconstitute() — nunca instanciar diretamente.
     */
    abstract toDomain(row: TRow): TAggregate;

    /**
     * Converte um Aggregate em um registro plano para persistência.
     * Value Objects são achatados em colunas primitivas.
     */
    abstract toPersistence(aggregate: TAggregate): TRow;

    /**
     * Converte um Aggregate em um DTO serializável para entrega.
     * Nunca expõe métodos ou referências ao Aggregate original.
     */
    toDTO(_aggregate: TAggregate): TDTO {
        throw new Error(
            `toDTO not implemented in ${this.constructor.name}. ` +
                `Implement it if this mapper needs presentation output.`,
        );
    }
}
