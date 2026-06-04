import { Entity, EntityRequest } from "@core/entities/entity";

export interface SystemConfigProps extends EntityRequest {
  key: string;
  value: string;
  valueType: string;
}

export class SystemConfig extends Entity<SystemConfigProps> {
  static create(props: SystemConfigProps): SystemConfig {
    return new SystemConfig(props);
  }

  get key(): string {
    return this.props.key;
  }

  set key(key: string) {
    this.props.key = key;
  }

  get value(): string {
    return this.props.value;
  }

  set value(value: string) {
    this.props.value = value;
  }

  get valueType(): string {
    return this.props.valueType;
  }

  set valueType(valueType: string) {
    this.props.valueType = valueType;
  }
}
