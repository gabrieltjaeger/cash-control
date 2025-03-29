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

    if (associate.mensalities.length === 0)
      throw new Error("Mensalities not found");

    const mensalities = associate.mensalities.map(
      (associateMensality) => associateMensality.mensality
    );

    return mensalities;
  }
}
