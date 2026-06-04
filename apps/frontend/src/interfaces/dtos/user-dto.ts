import { Role } from "@/types/role";

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  active: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
