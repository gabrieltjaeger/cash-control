import { IWriter } from "../contracts/IWriter.js";
import type { Role } from "./Role.js";

export interface IRoleWriter extends IWriter<Role> {
    delete(name: string): Promise<void>;
}
