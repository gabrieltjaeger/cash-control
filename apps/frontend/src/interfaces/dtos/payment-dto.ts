import { AssociateDTO } from "@/interfaces/dtos/associate-dto";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";

export interface PaymentDTO {
  id: string;
  date: Date;
  valueInCents: string;
  associateId: string;
  associate: AssociateDTO | null;
  mensalities: MensalityDTO[] | null;
  createdAt: Date;
  updatedAt: Date | null;
}
