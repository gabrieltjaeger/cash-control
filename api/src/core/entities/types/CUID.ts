import { createId } from "@paralleldrive/cuid2";

export class CUID {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? createId();
  }

  get value(): string {
    return this._value;
  }

  public equals(id: CUID | string): boolean {
    if (typeof id === "string") {
      return this.value === id;
    }

    return this.value === id.value;
  }

  public toString(): string {
    return this.value;
  }
}
