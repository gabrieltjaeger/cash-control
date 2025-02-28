import { AssociatesRepository } from "@core/repositories/associates-repository";

interface ListAssociatesUseCaseRequest {
  name?: string;
  page?: number;
  take?: number;
}

export class ListAssociatesUseCase {
  constructor(private associatesRepository: AssociatesRepository) {}

  async execute({ name, page, take }: ListAssociatesUseCaseRequest) {
    const associates = await this.associatesRepository.list(
      "minimal",
      { fullName: name },
      page,
      take
    );

    return { associates };
  }
}
