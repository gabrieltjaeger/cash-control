import { Mensality, Month } from "@core/entities/mensality";
import { MensalitiesRepository } from "@core/repositories/mensalities-repository";

interface RegisterMensalityUseCaseRequest {
  month: Month;
  year: number;
  priceInCents: bigint;
}

export class RegisterMensalityUseCase {
  constructor(private mensalitiesRepository: MensalitiesRepository) {}

  async execute({
    month,
    year,
    priceInCents,
  }: RegisterMensalityUseCaseRequest): Promise<void> {
    const mensalityExists = await this.mensalitiesRepository.find("minimal", {
      month,
      year,
    });

    if (mensalityExists) {
      throw new Error("Mensality already exists");
    }

    const mensality = Mensality.create({
      month,
      year,
      priceInCents,
    });

    await this.mensalitiesRepository.create(mensality);
  }
}
