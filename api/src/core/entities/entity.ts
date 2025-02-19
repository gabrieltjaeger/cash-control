import { CUID } from "@core/entities/types/CUID";
import { Optional } from "utility-types";

export interface EntityProps {
  id: CUID;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface EntityRequest
  extends Optional<EntityProps, "id" | "createdAt" | "updatedAt"> {}

export abstract class Entity<Props> {
  private _props: Props & EntityProps;

  protected constructor(
    props: Props & Optional<EntityProps, "id" | "createdAt" | "updatedAt">
  ) {
    this._props = {
      ...props,
      id: props.id ?? new CUID(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    };
  }

  get props(): Props & EntityProps {
    return this._props;
  }

  get id(): CUID {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(date: Date) {
    this.props.createdAt = date;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }

  set updatedAt(date: Date | null) {
    this.props.updatedAt = date;
  }

  public touch(): void {
    this.updatedAt = new Date();
  }
}
