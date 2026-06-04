import { Err, Ok, type Result } from "./Result.js";

/**
 * Operators — Funções standalone para transformar e encadear Results.
 *
 * São funções puras (não métodos de classe) para preservar a natureza
 * plain-object serializável do Result discriminated union.
 *
 * Disponíveis no frontend e backend via @jaeger/shared-contracts.
 */

/**
 * Transforma o valor de um Ok preservando o Err inalterado.
 *
 *   map(Ok(2), n => n * 10)        // Ok(20)
 *   map(Err("oops"), n => n * 10)  // Err("oops")
 */
export function map<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => U,
): Result<U, E> {
    return result.ok ? Ok(fn(result.value)) : result;
}

/**
 * Encadeia operações que retornam Result, achatando aninhamento.
 *
 *   flatMap(Ok("ok"), s => Ok(s.length))   // Ok(2)
 *   flatMap(Ok("ok"), s => Err("nope"))    // Err("nope")
 *   flatMap(Err("err"), s => Ok(1))        // Err("err")
 */
export function flatMap<T, U, E, F>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, F>,
): Result<U, E | F> {
    return result.ok ? fn(result.value) : result;
}

/**
 * Transforma o erro de um Err preservando o Ok inalterado.
 * Útil para traduzir erros entre camadas.
 *
 *   mapError(Err("low"), e => new DomainError(e))  // Err(DomainError)
 *   mapError(Ok(1), e => ...)                      // Ok(1)
 */
export function mapError<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F,
): Result<T, F> {
    return result.ok ? result : Err(fn(result.error));
}

/**
 * Desempacota o valor do Ok ou retorna um default.
 *
 *   getOrElse(Ok(42), 0)    // 42
 *   getOrElse(Err("e"), 0)  // 0
 */
export function getOrElse<T, E>(result: Result<T, E>, fallback: T): T {
    return result.ok ? result.value : fallback;
}

/**
 * Desempacota o valor do Ok ou deriva um valor a partir do erro.
 *
 *   getOrElseGet(Err("e"), err => err.length)  // 1
 */
export function getOrElseGet<T, E>(
    result: Result<T, E>,
    fn: (error: E) => T,
): T {
    return result.ok ? result.value : fn(result.error);
}

/**
 * Executa um efeito colateral se Ok, retorna o Result original inalterado.
 * Útil para logging sem quebrar o encadeamento.
 *
 *   tap(Ok(42), v => console.log(v))  // Ok(42), com side effect
 */
export function tap<T, E>(
    result: Result<T, E>,
    fn: (value: T) => void,
): Result<T, E> {
    if (result.ok) fn(result.value);
    return result;
}

/**
 * Executa um efeito colateral se Err, retorna o Result original inalterado.
 *
 *   tapError(Err("e"), err => log(err))  // Err("e"), com side effect
 */
export function tapError<T, E>(
    result: Result<T, E>,
    fn: (error: E) => void,
): Result<T, E> {
    if (!result.ok) fn(result.error);
    return result;
}

/**
 * Adapta uma função síncrona que pode lançar em um Result.
 * Útil na fronteira com código legado ou APIs que usam throw.
 *
 *   tryCatch(() => JSON.parse(raw), e => new ParseError(e))
 */
export function tryCatch<T, E = Error>(
    fn: () => T,
    onError: (err: unknown) => E,
): Result<T, E> {
    try {
        return Ok(fn());
    } catch (err) {
        return Err(onError(err));
    }
}

/**
 * Versão assíncrona de tryCatch.
 *
 *   await tryCatchAsync(() => fetch(url), e => new NetworkError(e))
 */
export async function tryCatchAsync<T, E = Error>(
    fn: () => Promise<T>,
    onError: (err: unknown) => E,
): Promise<Result<T, E>> {
    try {
        return Ok(await fn());
    } catch (err) {
        return Err(onError(err));
    }
}
