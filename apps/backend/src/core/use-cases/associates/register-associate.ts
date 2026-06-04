import { Associate } from "@core/entities/associate";
import { AssociatesRepository } from "@core/repositories/associates-repository";

import { ExistingResourceError } from "@core/errors/existing-resource-error";

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
    const existingAssociateEmail = await this.associatesRepository.find(
      "minimal",
      { email }
    );

    if (existingAssociateEmail) {
      throw new ExistingResourceError("Associate", "email");
    }

    const existingAssociatePhone = await this.associatesRepository.find(
      "minimal",
      { phone }
    );

    if (existingAssociatePhone) {
      throw new ExistingResourceError("Associate", "phone");
    }

    const associate = Associate.create({ fullName, email, phone });

    await this.associatesRepository.create(associate);
  }
}
