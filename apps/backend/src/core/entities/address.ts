import { Associate } from "@core/entities/associate";
import { Entity, EntityRequest } from "@core/entities/entity";

import { Optional } from "utility-types";

export interface AddressProps extends EntityRequest {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;

  associates?: Map<string, Associate>;
}

export class Address extends Entity<AddressProps> {
  static create(props: Optional<AddressProps, "complement">): Address {
    return new Address({
      ...props,
      complement: props.complement ?? null,
    });
  }

  get street(): string {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
  }

  get number(): string {
    return this.props.number;
  }

  set number(number: string) {
    this.props.number = number;
  }

  get complement(): string | null {
    return this.props.complement ?? null;
  }

  set complement(complement: string | null) {
    this.props.complement = complement ?? null;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
  }

  get city(): string {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get state(): string {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
  }

  get country(): string {
    return this.props.country;
  }

  set country(country: string) {
    this.props.country = country;
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode;
  }

  get associates(): Map<string, Associate> {
    return this.props.associates ?? new Map<string, Associate>();
  }

  set associates(associates: Map<string, Associate>) {
    this.props.associates = associates;
  }
}
