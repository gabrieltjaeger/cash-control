import type { AppError, Result } from "@jaeger/shared-contracts";
import type { IQuery } from "./CommandQueryMarkers.js";

/**
 * BaseQueryUseCase — Template Method para Query Use Cases (leituras).
 *
 * Queries não mutam estado. Não precisam de UoW, idempotência, ou outbox.
 * O QueryBus apenas resolve o handler, executa, e trata erros não-Result
 * (exceções inesperadas viram InfrastructureError automaticamente).
 *
 * REGRA imposta pelo motor Jaeger Forge:
 *   - QueryUseCaseCannotHaveSideEffectsRule: proibido save/insert/update/delete
 *     dentro de executeQuery.
 *
 * EXEMPLO:
 *
 *   export class GetProfileByIdQuery implements IQuery {
 *     constructor(public readonly profileId: string) {}
 *   }
 *
 *   export class GetProfileByIdUseCase extends BaseQueryUseCase<
 *     GetProfileByIdQuery,
 *     ProfileView
 *   > {
 *     constructor(private readonly deps: { profileRepo: IProfileRepository }) {
 *       super();
 *     }
 *
 *     protected async executeQuery(
 *       query: GetProfileByIdQuery,
 *     ): Promise<Result<ProfileView, AppError[]>> {
 *       const profile = await this.deps.profileRepo.findById(query.profileId);
 *       if (!profile) {
 *         return Err([new NotFoundError("Profile", query.profileId)]);
 *       }
 *       return Ok(ProfilePresenter.toView(profile));
 *     }
 *   }
 *
 * Em CQRS estrito, Queries podem ler de Read Models otimizados em
 * /delivery/projection em vez do banco de escrita.
 */
export abstract class BaseQueryUseCase<TQuery extends IQuery, TResult> {
    /**
     * Ponto de entrada chamado pelo QueryBus.
     * NÃO sobrescrever em subclasses.
     */
    public async execute(query: TQuery): Promise<Result<TResult, AppError[]>> {
        return this.executeQuery(query);
    }

    /**
     * Implementação concreta da query. Pode chamar APENAS métodos de leitura.
     * NUNCA mutações.
     */
    protected abstract executeQuery(
        query: TQuery,
    ): Promise<Result<TResult, AppError[]>>;
}
