import type { AggregateRoot } from "../domain/AggregateRoot.js";

/**
 * IWriter<TAggregate> — Contrato de escrita de um Aggregate Root.
 *
 * SEGREGAÇÃO DE INTERFACES (ISP):
 *   IWriter é injetado apenas no IUnitOfWork e em testes de integração.
 *   Command Use Cases NUNCA recebem IWriter diretamente — a persistência
 *   é responsabilidade exclusiva do CommandBus via CommandOutcome.
 *
 *   Essa restrição é imposta pelo motor Jaeger Forge:
 *   CommandUseCaseCannotInjectWriterRule (fatal)
 *
 * EXTENSÃO:
 *   Repositórios concretos adicionam operações específicas estendendo IWriter:
 *
 *   export interface IProfileWriter extends IWriter<ProfileAggregate> {
 *     deleteByEmail(email: Email): Promise<void>;
 *   }
 */
export interface IWriter<TAggregate extends AggregateRoot> {
    save(aggregate: TAggregate): Promise<void>;
}
