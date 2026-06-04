import type { AggregateRoot } from "../domain/AggregateRoot.js";

/**
 * IReader<TAggregate> — Contrato de leitura de um Aggregate Root.
 *
 * SEGREGAÇÃO DE INTERFACES (ISP):
 *   Separar IReader de IWriter permite que Command Use Cases declarem
 *   dependência apenas em IReader (sem acesso a mutação) — tornando
 *   explícito na assinatura do construtor que aquele Use Case não persiste.
 *
 *   O CommandBus é o único que recebe o IWriter (via IUnitOfWork).
 *
 * EXTENSÃO:
 *   Repositórios concretos adicionam queries específicas estendendo IReader:
 *
 *   export interface IProfileReader extends IReader<ProfileAggregate> {
 *     findByEmail(email: Email): Promise<ProfileAggregate | null>;
 *     findAllByTeam(teamId: string): Promise<ProfileAggregate[]>;
 *   }
 */
export interface IReader<TAggregate extends AggregateRoot> {
    findById(id: string): Promise<TAggregate | null>;
}
