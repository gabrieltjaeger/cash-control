import { AssociatesRepository } from "@core/repositories/associates-repository";

interface ListAssociatesUseCaseRequest {
  page: number;
  name?: string;
  take?: number;
}

export class ListAssociatesUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({ name, page, take = 10 }: ListAssociatesUseCaseRequest) {
    const associates = await this.associatesRepository.list(
      "minimal",
      {
        fullName: name,
      },
      page,
      take
    );

    return { associates };
  }
}
