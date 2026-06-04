import type { AppError, Result } from "@jaeger/shared-contracts";
import type { CommandOutcome } from "./CommandOutcome.js";
import type { ICommand } from "./CommandQueryMarkers.js";
import type { CallerContext } from "../auth/CallerContext.js";

/**
 * BaseCommandUseCase — Template Method para Command Use Cases.
 *
 * REVISÃO ARQUITETURAL após introdução do CommandBus:
 *
 * Use Cases tornaram-se FUNÇÃO PURA do ponto de vista de persistência:
 *   input → CommandOutcome (lista de aggregates + valor de retorno)
 *
 * O Use Case NÃO chama mais:
 *   - repo.save() — feito pelo CommandBus via IUnitOfWork
 *   - idempotency.check() — feito pelo CommandBus antes de invocar este UC
 *   - uow.runInTransaction() — feito pelo CommandBus envolvendo a execução
 *
 * O Use Case CONTINUA fazendo:
 *   - Validar invariantes de domínio
 *   - Carregar aggregates necessários via repositórios (LEITURA)
 *   - Invocar métodos de mutação nos aggregates
 *   - Retornar CommandOutcome com aggregates a persistir
 *
 * RESULTADO:
 *   - Use Cases são triviais de testar (sem mocks complexos)
 *   - Lógica de domínio fica isolada de I/O de persistência
 *   - CommandBus orquestra UoW + Outbox + Idempotência uniformemente
 *
 * EXEMPLO:
 *
 *   export class CreateProfileUseCase extends BaseCommandUseCase<
 *     CreateProfileCommand,
 *     { profileId: string }
 *   > {
 *     constructor(private readonly deps: {
 *       profileRepo: IProfileRepository;  // só usado para LEITURA aqui
 *     }) { super(); }
 *
 *     protected async executeCommand(
 *       cmd: CreateProfileCommand,
 *     ): Promise<Result<CommandOutcome<{ profileId: string }>, AppError[]>> {
 *
 *       const existing = await this.deps.profileRepo.findByEmail(cmd.email);
 *       if (existing) {
 *         return Err([new DuplicateEmailError(cmd.email)]);
 *       }
 *
 *       const profile = ProfileAggregate.create({ ... });
 *       if (!profile.ok) return Err([profile.error]);
 *
 *       return Ok({
 *         result: { profileId: profile.value.id },
 *         aggregates: [profile.value],
 *       });
 *     }
 *   }
 */
export abstract class BaseCommandUseCase<TCommand extends ICommand, TResult> {
    /**
     * Ponto de entrada chamado pelo CommandBus.
     * NÃO sobrescrever em subclasses.
     */
    public async execute(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<CommandOutcome<TResult>, AppError[]>> {
        return this.executeCommand(command, caller);
    }

    /**
     * Subclasses implementam a lógica de domínio.
     *
     * Retorna:
     *   Ok(CommandOutcome) com os aggregates a persistir, OR
     *   Err(AppError[]) com lista de falhas para o caller
     *
     * Notar que o array de erros suporta applicative validation:
     * múltiplos erros (ex: validações de form) podem ser retornados juntos.
     */
    protected abstract executeCommand(
        command: TCommand,
        caller: CallerContext,
    ): Promise<Result<CommandOutcome<TResult>, AppError[]>>;
}
