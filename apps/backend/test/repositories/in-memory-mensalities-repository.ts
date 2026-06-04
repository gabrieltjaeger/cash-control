import { Mensality, Month } from "@core/entities/mensality";
import { MensalitiesRepository } from "@core/repositories/mensalities-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export class InMemoryMensalitiesRepository implements MensalitiesRepository {
  public items: Mensality[] = [];

  async create(mensality: Mensality): Promise<void> {
    this.items.push(mensality);
  }

  async update(mensality: Mensality): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(mensality.id));
    this.items[index] = mensality;
  }

  async find<T extends RepositoryQueryMode>(
    mode: T,
    {
      id,
      month,
      year,
    }: {
      id?: string | undefined;
      month?: Month | undefined;
      year?: number | undefined;
    }
  ): Promise<any> {
    const mensality = this.items.find((item) => {
      if (id) return item.id.toString() === id;
      if (month && year) return item.month === month && item.year === year;
      return false;
    });

    if (!mensality) return null;

    return mensality;
  }
}
