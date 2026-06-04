import { DeepPartial } from "utility-types";

export type View<T extends object> =
  | ({
      [K in keyof T]?: DeepPartial<T[K]> | unknown;
    } & {
      [key: string]: unknown;
    })
  | void;
