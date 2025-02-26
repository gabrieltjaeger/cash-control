import { MensalitiesRepository } from "@core/repositories/mensalities-repository";

interface ListMensalitiesUseCaseRequest {
  year: number;
}

export class ListMensalitiesUseCase {
  constructor(private mensalitiesRepository: MensalitiesRepository) {}

  async execute({ year }: ListMensalitiesUseCaseRequest) {
    const mensalities = await this.mensalitiesRepository.list("minimal", {
      year,
      page: 1,
      take: 12,
    });

    return { mensalities };
  }
}
