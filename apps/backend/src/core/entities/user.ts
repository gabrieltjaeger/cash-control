import { Entity, EntityRequest } from "@core/entities/entity";
import { Optional } from "utility-types";

export type Role = "ADMIN" | "USER";

export interface UserProps extends EntityRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  active: boolean;
  verifiedAt: Date | null;
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, "verifiedAt">): User {
    return new User({
      ...props,
      verifiedAt: props.verifiedAt ?? null,
    });
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
  }

  get roles(): Role[] {
    return this.props.roles;
  }

  get isAdmin(): boolean {
    return this.roles.includes("ADMIN");
  }

  get active(): boolean {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
  }

  get verifiedAt(): Date | null {
    return this.props.verifiedAt;
  }

  set verifiedAt(verifiedAt: Date | null) {
    this.props.verifiedAt = verifiedAt;
  }

  verify(): void {
    this.props.active = true;
    this.props.verifiedAt = new Date();
    this.touch();
  }
}
