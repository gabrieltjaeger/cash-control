import { Err, Ok, Result } from "./Result.js";

/**
 * Operadores de combinação de múltiplos Results.
 *
 * combineAll  → applicative validation (coleta TODOS os erros)
 * combineFirst → fail-fast (curto-circuito no primeiro erro)
 *
 * Escolha entre eles depende do contexto:
 *   - Validação de formulário        → combineAll (UX exibe todos os erros)
 *   - Pipeline de processamento      → combineFirst (parar cedo é mais barato)
 *   - Bootstrapping de aggregates    → combineAll (relatório completo)
 *   - Saga de múltiplos passos       → combineFirst (compensação reverte)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResult = Result<any, any>;

type ExtractValues<T extends readonly AnyResult[]> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T[K] extends Result<infer V, any> ? V : never;
};

type ExtractErrors<T extends readonly AnyResult[]> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: T[K] extends Result<any, infer E> ? E : never;
}[number];

/**
 * Applicative validation: avalia TODOS os Results e acumula erros.
 *
 * Se algum falhar, retorna Err com array de TODOS os erros encontrados.
 * Se todos passarem, retorna Ok com tupla perfeitamente tipada de valores.
 *
 *   const r = combineAll([
 *     Email.create(form.email),
 *     Name.create(form.name),
 *     Age.create(form.age),
 *   ] as const);
 *
 *   if (!r.ok) {
 *     // r.error: Array<ValidationError>
 *     // Frontend exibe TODOS os erros simultaneamente.
 *   } else {
 *     // r.value: [Email, Name, Age]  ← tupla preservada
 *   }
 */
export function combineAll<T extends readonly AnyResult[]>(
    results: readonly [...T],
): Result<ExtractValues<T>, ExtractErrors<T>[]> {
    const values: unknown[] = [];
    const errors: unknown[] = [];

    for (const res of results) {
        if (res.ok) {
            values.push(res.value);
        } else {
            errors.push(res.error);
        }
    }

    if (errors.length > 0) {
        return Err(errors as ExtractErrors<T>[]);
    }
    return Ok(values as unknown as ExtractValues<T>);
}

/**
 * Fail-fast: encerra na primeira falha. Retorna o erro singular (não array).
 *
 *   const r = combineFirst([step1(), step2(), step3()] as const);
 *
 *   if (!r.ok) {
 *     // r.error: erro singular do primeiro step que falhou
 *   }
 */
export function combineFirst<T extends readonly AnyResult[]>(
    results: readonly [...T],
): Result<ExtractValues<T>, ExtractErrors<T>> {
    const values: unknown[] = [];

    for (const res of results) {
        if (!res.ok) {
            return res as Result<ExtractValues<T>, ExtractErrors<T>>;
        }
        values.push(res.value);
    }

    return Ok(values as unknown as ExtractValues<T>);
}

/**
 * Particiona uma lista de Results em dois arrays: valores ok e erros.
 * Útil para reports de operações em batch onde alguns itens podem falhar.
 *
 *   const { values, errors } = partition([r1, r2, r3, r4]);
 */
export function partition<T, E>(
    results: readonly Result<T, E>[],
): { values: T[]; errors: E[] } {
    const values: T[] = [];
    const errors: E[] = [];

    for (const res of results) {
        if (res.ok) values.push(res.value);
        else errors.push(res.error);
    }

    return { values, errors };
}
