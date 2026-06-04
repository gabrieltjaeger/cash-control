/**
 * IGateway — Marker interface para gateways de serviços externos.
 *
 * DIFERENÇA ENTRE Repository e Gateway:
 *   - Repository: persiste Aggregate Roots em banco de dados local.
 *   - Gateway:    representa qualquer outro serviço externo
 *                 (e-mail, pagamento, S3, filesystem, AST parser,
 *                  Git CLI, geocoding, etc.)
 *
 * REGRA DE NOMENCLATURA (imposta pelo motor):
 *   Gateways descrevem CAPACIDADES, não FORNECEDORES.
 *
 *   CORRETO:   IEmailGateway, IFileSystemGateway, IGitGateway
 *   PROIBIDO:  ISendGridGateway, INodeFsGateway, IGitHubGateway
 *
 * A implementação concreta em /infra carrega o nome do fornecedor:
 *
 *   class SendGridEmailGateway implements IEmailGateway { ... }
 *   class NodeFileSystemGateway implements IFileSystemGateway { ... }
 *
 * Esta interface base é propositalmente vazia. Serve como marker
 * (anotação de tipo) que os adapters implementam, e que o motor
 * Jaeger Forge usa para detectar contratos de Gateway durante a
 * validação arquitetural.
 *
 * Cada Gateway específico define seus próprios métodos:
 *
 *   export interface IEmailGateway extends IGateway {
 *     send(to: Email, subject: string, body: string): Promise<void>;
 *   }
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGateway {
    readonly __brand: "Gateway";
}
