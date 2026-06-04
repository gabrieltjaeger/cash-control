import type { Role } from "./Role.js";
import { IRepository } from "../contracts/IRepository.js";
import { IRoleReader } from "./IRoleReader.js";
import { IRoleWriter } from "./IRoleWriter.js";

/**
 * IRoleRepository — Contrato de acesso a roles.
 *
 * IMPLEMENTAÇÃO CONCRETA: SqliteRoleRepository em access/identity/infra/
 *
 * Este contrato está em shared/core porque o IAuthorizationService
 * precisa carregar roles para avaliar permissões, e o serviço de
 * autorização é compartilhado por todos os módulos.
 *
 * CACHE:
 *   Roles mudam raramente. A implementação concreta deve usar cache
 *   em memória com TTL curto (ex: 60s) para evitar queries frequentes.
 *   O cache é invalidado quando um RoleUpdatedIntegrationEvent é recebido.
 */
export interface IRoleRepository extends IRepository<
    Role,
    IRoleReader,
    IRoleWriter
> {}
