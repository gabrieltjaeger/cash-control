import { IReader } from "../contracts/IReader.js";
import type { Role } from "./Role.js";

export interface IRoleReader extends IReader<Role> {
    findByName(name: string): Promise<Role | null>;
    findAll(): Promise<Role[]>;
    findByNames(names: string[]): Promise<Role[]>;
}