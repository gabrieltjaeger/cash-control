/**
 * ValueObject — Base abstrata para objetos de valor do domínio.
 *
 * CARACTERÍSTICAS FUNDAMENTAIS (Evans, 2003):
 *   1. SEM IDENTIDADE: dois Value Objects são "iguais" se todos os seus
 *      atributos são iguais. Não há campo `id`.
 *   2. IMUTÁVEIS: uma vez criados, nunca mutam. Todos os atributos devem
 *      ser readonly. Operações que "modificam" retornam novas instâncias.
 *   3. AUTO-VALIDANTES: o método estático create() retorna Result e nunca
 *      permite construir instâncias inválidas.
 *   4. SUBSTITUÍVEIS: como não têm identidade, podem ser livremente trocados
 *      por outra instância com mesmos atributos.
 *
 * EXEMPLO CANÔNICO:
 *
 *   export class Email extends ValueObject {
 *     private constructor(public readonly value: string) {
 *       super();
 *     }
 *
 *     static create(raw: string): Result<Email, ValidationError> {
 *       if (!raw.includes('@')) {
 *         return Result.failure(ValidationError.forField('email', 'must contain @'));
 *       }
 *       return Result.success(new Email(raw.toLowerCase().trim()));
 *     }
 *
 *     static reconstitute(raw: string): Email {
 *       // confia em dados do banco, pula validação pesada
 *       return new Email(raw);
 *     }
 *   }
 *
 * REGRAS QUE O MOTOR JAEGER FORGE VAI VALIDAR (auto-imposição):
 *   - Construtor deve ser private
 *   - Todos os atributos devem ser readonly
 *   - Não pode ter atributo chamado 'id'
 *   - create() deve retornar Result<T, ValidationError>
 *   - reconstitute() pode pular validação mas mantém imutabilidade
 */
export abstract class ValueObject {
    /**
     * Compara dois Value Objects estruturalmente.
     *
     * Esta implementação default usa serialização JSON para comparar
     * propriedades enumeráveis. Funciona para a esmagadora maioria dos
     * Value Objects (atributos primitivos ou outros VOs).
     *
     * Subclasses com lógica customizada (ex: tolerância numérica em Money)
     * podem sobrescrever este método.
     */
    public equals(other?: ValueObject | null): boolean {
        if (other === null || other === undefined) return false;
        if (this === other) return true;

        // Mesma classe?
        if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
            return false;
        }

        // Comparação estrutural via serialização determinística
        return this.serialize() === other.serialize();
    }

    /**
     * Serialização para comparação. Coleta props enumeráveis em chave
     * estável (ordenada).
     *
     * Não usa JSON.stringify direto porque a ordem de chaves não é garantida
     * em todos os runtimes para objetos construídos dinamicamente.
     */
    protected serialize(): string {
        const props = this.collectProps();
        const sortedKeys = Object.keys(props).sort();
        const ordered: Record<string, unknown> = {};
        for (const key of sortedKeys) {
            ordered[key] = props[key];
        }
        return JSON.stringify(ordered);
    }

    /**
     * Coleta todas as propriedades enumeráveis para serialização.
     * Subclasses raramente precisam sobrescrever isto.
     */
    private collectProps(): Record<string, unknown> {
        const props: Record<string, unknown> = {};
        for (const key of Object.keys(this)) {
            const value = (this as unknown as Record<string, unknown>)[key];
            if (typeof value !== "function") {
                props[key] = value;
            }
        }
        return props;
    }

    /**
     * Hash estrutural usado para inclusão em Set/Map.
     * Equivale ao serialize() mas pode ser sobrescrito.
     */
    public hashCode(): string {
        return this.serialize();
    }
}
