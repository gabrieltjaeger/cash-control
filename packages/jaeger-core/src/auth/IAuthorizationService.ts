import type { CallerContext } from "./CallerContext.js";
import type { Permission } from "./Permission.js";
import type { PolicyDecision } from "./PolicyDecision.js";

/**
 * ResourceContext — Atributos do recurso sendo acessado.
 * Usado pelas políticas ABAC para avaliar condições sobre o recurso.
 *
 * EXEMPLOS:
 *   { ownerId: "profile_001", status: "active", projectId: "proj_x" }
 *   { componentType: "AGGREGATE_ROOT", moduleId: "mod_identity" }
 */
export type ResourceContext = Record<string, unknown>;

/**
 * IAuthorizationService — Avalia se um caller pode executar uma ação.
 *
 * COMPOSIÇÃO INTERNA:
 *   A implementação concreta (CompositeAuthorizationService) combina:
 *   1. RBACEngine   → verifica roles e permissões
 *   2. ABACEngine   → aplica regras de atributo (se fornecido resourceContext)
 *
 * SEQUÊNCIA DE AVALIAÇÃO:
 *   1. RBAC: caller tem a permission?
 *      → DENY imediato se não tem
 *   2. ABAC: as regras de atributo permitem?
 *      → DENY imediato se alguma regra nega explicitamente
 *   3. Se passou ambos → PERMIT
 *
 * FAIL-SECURE:
 *   Em caso de erro interno ou nenhuma regra aplicável → DENY.
 *   Sistemas de segurança sempre falham fechados.
 *
 * USO NOS USE CASES:
 *
 *   protected async executeCommand(cmd: DeleteComponentCommand) {
 *     const decision = await this.authService.authorize(
 *       cmd.caller,
 *       PermissionCatalog.COMPONENT_DELETE,
 *       { ownerId: component.createdBy, projectId: component.projectId },
 *     );
 *
 *     if (!decision.isPermit) {
 *       return Err([new ForbiddenError("component:delete", decision.reason)]);
 *     }
 *     // ... lógica de negócio
 *   }
 */
export interface IAuthorizationService {
    /**
     * Avalia se o caller pode executar a permission sobre o recurso.
     *
     * @param caller           Quem está fazendo a requisição
     * @param permission       O que está tentando fazer
     * @param resourceContext  Atributos do recurso (opcional, para ABAC)
     */
    authorize(
        caller: CallerContext,
        permission: Permission,
        resourceContext?: ResourceContext,
    ): Promise<PolicyDecision>;

    /**
     * Versão síncrona para checks simples que não precisam de I/O.
     * Avalia apenas RBAC (sem ABAC que pode requerer banco).
     */
    authorizeSync(
        caller: CallerContext,
        permission: Permission,
    ): PolicyDecision;
}

/**
 * ITokenService — Contrato para emissão e validação de tokens de autenticação.
 *
 * Tokens são opacos para o domínio (string). O serviço concreto decide
 * o formato (JWT, PASETO, UUID signed, etc).
 *
 * SEPARAÇÃO DE RESPONSABILIDADES:
 *   ITokenService → emite e valida tokens (autenticação)
 *   IAuthorizationService → avalia permissões (autorização)
 *   AuthenticationMiddleware → orquestra os dois para criar CallerContext
 */
export interface ITokenService {
    /**
     * Emite um token para um caller autenticado.
     *
     * @param callerId   ID do token/sessão
     * @param profileId  ID do perfil do usuário
     * @param ttlSeconds Tempo de vida em segundos
     */
    issue(
        callerId: string,
        profileId: string,
        ttlSeconds: number,
    ): Promise<string>;

    /**
     * Valida um token e extrai o payload.
     * Retorna null se inválido, expirado, ou revogado.
     */
    validate(token: string): Promise<TokenPayload | null>;

    /**
     * Revoga um token imediatamente (logout).
     */
    revoke(token: string): Promise<void>;
}

export interface TokenPayload {
    readonly callerId: string;
    readonly profileId: string;
    readonly issuedAt: Date;
    readonly expiresAt: Date;
}
