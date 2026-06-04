import { AddressDTO } from "@/interfaces/dtos/address-dto";
import { MensalityDTO } from "@/interfaces/dtos/mensality-dto";
import { PaymentDTO } from "@/interfaces/dtos/payment-dto";

export interface AssociateDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressId: string;
  address: AddressDTO | null;
  payments: PaymentDTO[] | null;
  mensalities: MensalityDTO[] | null;
  createdAt: Date;
  updatedAt: Date | null;
}
