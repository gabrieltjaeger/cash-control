import type { IReader } from "./IReader.js";
import type { IWriter } from "./IWriter.js";
import type { AggregateRoot } from "../domain/AggregateRoot.js";

/**
 * IRepository — União de IReader e IWriter para um Aggregate Root.
 *
 * TIPO UTILITÁRIO (não uma interface nova):
 *   IRepository não adiciona métodos — apenas une os contratos de leitura
 *   e escrita em um único tipo, com parametrização que permite estender
 *   ambos os lados independentemente.
 *
 * USO PADRÃO (repositório base sem extensão):
 *   class SqliteProfileRepository implements IRepository<ProfileAggregate> {
 *     findById(id): Promise<ProfileAggregate | null> { ... }
 *     save(aggregate): Promise<void> { ... }
 *   }
 *
 * USO COM EXTENSÃO (queries e mutações específicas):
 *   interface IProfileReader extends IReader<ProfileAggregate> {
 *     findByEmail(email: Email): Promise<ProfileAggregate | null>;
 *   }
 *   interface IProfileWriter extends IWriter<ProfileAggregate> {
 *     deleteByEmail(email: Email): Promise<void>;
 *   }
 *   class SqliteProfileRepository
 *     implements IRepository<ProfileAggregate, IProfileReader, IProfileWriter> { ... }
 *
 * INJEÇÃO NOS USE CASES:
 *   Command Use Cases injetam apenas IProfileReader (sem acesso a save).
 *   O CommandBus acessa o IWriter via IUnitOfWork.
 */
export type IRepository<
    TAggregate extends AggregateRoot,
    TReader extends IReader<TAggregate> = IReader<TAggregate>,
    TWriter extends IWriter<TAggregate> = IWriter<TAggregate>,
> = TReader & TWriter;
