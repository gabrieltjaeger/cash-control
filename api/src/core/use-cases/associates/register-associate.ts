import { Associate } from "@core/entities/associate";
import { AssociatesRepository } from "@core/repositories/associates-repository";

interface RegisterAssociateUseCaseRequest {
  fullName: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export class RegisterAssociateUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({
    fullName,
    email,
    phone,
    address,
  }: RegisterAssociateUseCaseRequest): Promise<void> {
    const associate = Associate.create({ fullName, email, phone });

    await this.associatesRepository.create(associate);
  }
}
