import { AssociatesRepository } from "@core/repositories/associates-repository";

interface FetchAssociateUseCaseRequest {
  id: string;
}

export class FetchAssociateUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({ id }: FetchAssociateUseCaseRequest) {
    const associate = await this.associatesRepository.find("minimal", { id });

    if (!associate) throw new Error("Associate not found");

    return { associate };
  }
}
