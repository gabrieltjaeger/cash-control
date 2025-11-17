import { AssociatesRepository } from "@core/repositories/associates-repository";

interface FetchAssociateMensalitiesUseCaseRequest {
  id: string;
  year: number;
}

export class FetchAssociateMensalitiesUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({ id, year }: FetchAssociateMensalitiesUseCaseRequest) {
    const associate = await this.associatesRepository.find("deep", {
      id,
      year,
    });

    if (!associate) throw new Error("Associate not found");

    return { associate };
  }
}
