import { AssociatesRepository } from "@core/repositories/associates-repository";
import { ExistingResourceError } from "@core/errors/existing-resource-error";

interface UpdateAssociateUseCaseRequest {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export class UpdateAssociateUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({
    id,
    fullName,
    email,
    phone,
  }: UpdateAssociateUseCaseRequest): Promise<void> {
    const associate = await this.associatesRepository.find("minimal", { id });

    if (!associate) {
      throw new Error("Associate not found");
    }

    if (email && email !== associate.email) {
      const existingAssociateEmail = await this.associatesRepository.find(
        "minimal",
        { email }
      );

      if (existingAssociateEmail) {
        throw new ExistingResourceError("Associate", "email");
      }

      associate.email = email;
    }

    if (phone && phone !== associate.phone) {
      const existingAssociatePhone = await this.associatesRepository.find(
        "minimal",
        { phone }
      );

      if (existingAssociatePhone) {
        throw new ExistingResourceError("Associate", "phone");
      }

      associate.phone = phone;
    }

    if (fullName) {
      associate.fullName = fullName;
    }

    await this.associatesRepository.update(associate);
  }
}
