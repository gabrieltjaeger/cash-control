import { Associate } from "@core/entities/associate";
import { AssociatesRepository } from "@core/repositories/associates-repository";
import { RepositoryQueryMode } from "@core/types/repository-query-mode";

export class InMemoryAssociatesRepository implements AssociatesRepository {
  public items: Associate[] = [];

  async create(associate: Associate): Promise<void> {
    this.items.push(associate);
  }

  async update(associate: Associate): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(associate.id));
    this.items[index] = associate;
  }

  async find<T extends RepositoryQueryMode>(
    mode: T,
    {
      id,
      email,
      phone,
    }: {
      id?: string | undefined;
      email?: string | undefined;
      phone?: string | undefined;
    }
  ): Promise<any> {
    const associate = this.items.find((item) => {
      if (id) return item.id.toString() === id;
      if (email) return item.email === email;
      if (phone) return item.phone === phone;
      return false;
    });

    if (!associate) return null;

    return associate;
  }
}
