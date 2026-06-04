/**
 * Result — Discriminated union para operações que podem falhar.
 *
 * Compartilhado entre backend e frontend via @jaeger/shared-contracts.
 *
 * Vantagens vs classe:
 *   - Serializável por padrão (JSON.stringify/parse round-trip).
 *   - Narrowing automático do TypeScript sem fricção.
 *   - Mesmo tipo nominal em ambos os lados do WebSocket.
 *   - Imutável via `readonly` em todos os campos.
 *
 * Uso típico:
 *
 *   function divide(a: number, b: number): Result<number, string> {
 *     if (b === 0) return Err("division by zero");
 *     return Ok(a / b);
 *   }
 *
 *   const r = divide(10, 2);
 *   if (r.ok) {
 *     console.log(r.value);   // narrowed: number
 *   } else {
 *     console.log(r.error);   // narrowed: string
 *   }
 */

export type Ok<T> = {
    readonly ok: true;
    readonly value: T;
};

export type Err<E> = {
    readonly ok: false;
    readonly error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Constrói um Ok wrapping um valor.
 */
export function Ok<T>(value: T): Ok<T> {
    return { ok: true, value };
}

/**
 * Constrói um Err wrapping um erro.
 */
export function Err<E>(error: E): Err<E> {
    return { ok: false, error };
}

/**
 * Ok pré-construído para Use Cases sem valor de retorno significativo.
 * Evita a verbosidade de `Ok(undefined)`.
 */
export const OkVoid: Ok<void> = { ok: true, value: undefined };

/**
 * Type guard verificando se um valor desconhecido tem forma de Result.
 * Útil para validação de mensagens vindas pela rede.
 */
export function isResult<T, E>(value: unknown): value is Result<T, E> {
    return (
        typeof value === "object" &&
        value !== null &&
        "ok" in value &&
        typeof (value as { ok?: unknown }).ok === "boolean"
    );
}

/**
 * Narrowing predicate para o ramo Ok.
 */
export function isOk<T, E>(value: Result<T, E>): value is Ok<T> {
    return value.ok;
}

/**
 * Narrowing predicate para o ramo Err.
 */
export function isErr<T, E>(value: Result<T, E>): value is Err<E> {
    return !value.ok;
}
