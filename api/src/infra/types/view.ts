import { DeepPartial } from "utility-types";

export type View<T extends object> = DeepPartial<T> | void;
