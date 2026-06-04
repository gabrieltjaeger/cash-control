import { Entity, EntityRequest } from "@core/entities/entity";
import { CUID } from "@core/entities/types/CUID";
import { User } from "@core/entities/user";

interface SessionProps extends EntityRequest {
  ipAddress: string;
  userAgent: string;

  userId: CUID;
  user?: User;
}

export class Session extends Entity<SessionProps> {
  static create(props: SessionProps) {
    return new Session(props);
  }

  get userId() {
    return this.props.userId;
  }

  get user() {
    return this.props.user;
  }

  get ipAddress() {
    return this.props.ipAddress;
  }

  get userAgent() {
    return this.props.userAgent;
  }
}
