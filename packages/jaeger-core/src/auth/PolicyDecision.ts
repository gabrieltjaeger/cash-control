/**
 * PolicyDecision — Resultado de uma avaliação de política de autorização.
 *
 * Inspirado no modelo XACML (eXtensible Access Control Markup Language),
 * que define três estados distintos para uma decisão de autorização.
 *
 * PERMIT:
 *   A política foi avaliada e concede acesso.
 *
 * DENY:
 *   A política foi avaliada e nega acesso explicitamente.
 *   Tem precedência sobre PERMIT em um sistema de múltiplas políticas.
 *
 * NOT_APPLICABLE:
 *   A política não se aplica a esta requisição (resource/action/contexto
 *   não são relevantes para esta política). O avaliador deve tentar
 *   outra política.
 *
 * POR QUE NÃO USAR BOOLEAN:
 *   Boolean force-fits a situação onde a política simplesmente não sabe
 *   responder. NOT_APPLICABLE permite composição correta: se nenhuma
 *   política se aplica, a decisão default é DENY (fail-secure).
 */
export type PolicyDecisionResult = "PERMIT" | "DENY" | "NOT_APPLICABLE";

export class PolicyDecision {
    private constructor(
        public readonly result: PolicyDecisionResult,
        public readonly reason: string,
    ) {}

    static permit(reason = "Access granted"): PolicyDecision {
        return new PolicyDecision("PERMIT", reason);
    }

    static deny(reason: string): PolicyDecision {
        return new PolicyDecision("DENY", reason);
    }

    static notApplicable(reason = "Policy does not apply"): PolicyDecision {
        return new PolicyDecision("NOT_APPLICABLE", reason);
    }

    get isPermit(): boolean {
        return this.result === "PERMIT";
    }

    get isDeny(): boolean {
        return this.result === "DENY";
    }

    get isNotApplicable(): boolean {
        return this.result === "NOT_APPLICABLE";
    }
}
