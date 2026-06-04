import { InMemoryAssociatesRepository } from "@test/repositories/in-memory-associates-repository";
import { UpdateAssociateUseCase } from "./update-associate";
import { makeAssociate } from "@test/factories/make-associate";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";
import { ExistingResourceError } from "@core/errors/existing-resource-error";

let inMemoryAssociatesRepository: InMemoryAssociatesRepository;
let sut: UpdateAssociateUseCase;

describe("Update Associate", () => {
  beforeEach(() => {
    inMemoryAssociatesRepository = new InMemoryAssociatesRepository();
    sut = new UpdateAssociateUseCase(inMemoryAssociatesRepository);
  });

  it("should be able to update a associate", async () => {
    const associate = makeAssociate();
    inMemoryAssociatesRepository.create(associate);

    await sut.execute({
      id: associate.id.toString(),
      fullName: "John Doe",
      email: "jonhdoe@email.com",
      phone: "123456789",
    });

    expect(inMemoryAssociatesRepository.items[0]).toMatchObject({
      fullName: "John Doe",
      email: "jonhdoe@email.com",
      phone: "123456789",
    });
  });

  it("should not be able to update a associate that does not exist", async () => {
    await expect(
      sut.execute({
        id: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a associate to a email that already exists", async () => {
    const associate1 = makeAssociate({ email: "jonhdoe@email.com" });
    const associate2 = makeAssociate({ email: "another@email.com" });
    inMemoryAssociatesRepository.create(associate1);
    inMemoryAssociatesRepository.create(associate2);

    await expect(
      sut.execute({
        id: associate2.id.toString(),
        email: "jonhdoe@email.com",
      })
    ).rejects.toBeInstanceOf(ExistingResourceError);
  });

  it("should not be able to update a associate to a phone that already exists", async () => {
    const associate1 = makeAssociate({ phone: "123456789" });
    const associate2 = makeAssociate({ phone: "987654321" });
    inMemoryAssociatesRepository.create(associate1);
    inMemoryAssociatesRepository.create(associate2);

    await expect(
      sut.execute({
        id: associate2.id.toString(),
        phone: "123456789",
      })
    ).rejects.toBeInstanceOf(ExistingResourceError);
  });
});
