import { ExistingResourceError } from "@core/errors/existing-resource-error";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";
import { Month } from "@core/entities/mensality";
import { MensalitiesRepository } from "@core/repositories/mensalities-repository";

interface UpdateMensalityUseCaseRequest {
  id: string;
  month?: Month;
  year?: number;
  priceInCents?: bigint;
}

export class UpdateMensalityUseCase {
  constructor(private mensalitiesRepository: MensalitiesRepository) {}

  async execute({
    id,
    month,
    year,
    priceInCents,
  }: UpdateMensalityUseCaseRequest): Promise<void> {
    const mensality = await this.mensalitiesRepository.find("minimal", { id });

    if (!mensality) {
      throw new ResourceNotFoundError("Mensality", `id ${id}`);
    }

    if (
      (month && month !== mensality.month) ||
      (year && year !== mensality.year)
    ) {
      const newMonth = month ?? mensality.month;
      const newYear = year ?? mensality.year;

      const existingMensality = await this.mensalitiesRepository.find(
        "minimal",
        { month: newMonth, year: newYear }
      );

      if (existingMensality && !existingMensality.id.equals(id)) {
        throw new ExistingResourceError("Mensality", `month ${newMonth} and year ${newYear}`);
      }

      if (month) mensality.month = month;
      if (year) mensality.year = year;
    }

    if (priceInCents !== undefined) {
      mensality.priceInCents = priceInCents;
    }

    await this.mensalitiesRepository.update(mensality);
  }
}
