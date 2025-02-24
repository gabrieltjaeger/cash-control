import { Mensality, Month } from "@core/entities/mensality";
import { MensalitiesRepository } from "@core/repositories/mensalities-repository";

interface RegisterMensalityUseCaseRequest {
  month: Month;
  year: number;
  value: number;
}

export class RegisterMensalityUseCase {
  constructor(private mensalitiesRepository: MensalitiesRepository) {}

  async execute({
    month,
    year,
    value,
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
      priceInCents: BigInt(value * 100),
    });

    await this.mensalitiesRepository.create(mensality);
  }
}
