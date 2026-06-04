import {
    validate as validateUuid,
    version as uuidVersion,
    v7 as uuidv7,
} from "uuid";
import { Err, Ok, type Result } from "@jaeger/shared-contracts";
import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "./ValueObject.js";

/**
 * UniqueEntityId — O Identificador Universal de Entidades.
 *
 * Utiliza estritamente UUID v7 (Time-Sortable).
 * O genérico <T> garante tipagem nominal via "Branded Types",
 * impedindo que o ID de um Agregado seja usado no lugar de outro.
 */
export class UniqueEntityId<T extends string = string> extends ValueObject {
    // O "Fantasma": Esta propriedade não existe no JavaScript transpilado.
    // Ela força o TypeScript a tratar UniqueEntityId<"Profile"> e
    // UniqueEntityId<"Invoice"> como tipos estruturalmente incompatíveis.
    declare readonly __brand: T;

    private constructor(public readonly value: string) {
        super();
    }

    /**
     * Gera um novo ID (Sempre UUID v7).
     * Graças à Inferência Contextual do TypeScript, não é necessário passar
     * o genérico <TBrand> manualmente se o destino já estiver tipado.
     */
    static create<TBrand extends string>(): UniqueEntityId<TBrand> {
        return new UniqueEntityId<TBrand>(uuidv7());
    }

    /**
     * Reconstitui um ID vindo de input externo (ex: da requisição HTTP/WS).
     * Valida rigorosamente se o formato é um UUID v7 legítimo.
     */
    static reconstitute<TBrand extends string>(
        raw: string,
    ): Result<UniqueEntityId<TBrand>, ValidationError> {
        if (!raw || typeof raw !== "string") {
            return Err(ValidationError.forField("id", "ID must be a string"));
        }

        if (!validateUuid(raw)) {
            return Err(
                ValidationError.forField("id", "ID must be a valid UUID"),
            );
        }

        // Garante consistência de performance em índices B-Tree do banco
        if (uuidVersion(raw) !== 7) {
            return Err(ValidationError.forField("id", "ID must be a UUID v7"));
        }

        return Ok(new UniqueEntityId<TBrand>(raw));
    }

    /**
     * Reconstitui um ID confiável vindo do banco de dados (via Mapper).
     * Pula a validação pesada por regex para máxima performance na hidratação.
     */
    static reconstituteTrusted<TBrand extends string>(
        trustedRaw: string,
    ): UniqueEntityId<TBrand> {
        return new UniqueEntityId<TBrand>(trustedRaw);
    }
}
