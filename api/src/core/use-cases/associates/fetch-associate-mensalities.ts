import { AssociatesRepository } from "@core/repositories/associates-repository";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";

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

    if (!associate) throw new ResourceNotFoundError("Associate", `id ${id}`);

    return { associate };
  }
}
