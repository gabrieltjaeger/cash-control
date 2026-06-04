import { InMemoryMensalitiesRepository } from "@test/repositories/in-memory-mensalities-repository";
import { UpdateMensalityUseCase } from "./update-mensality";
import { makeMensality } from "@test/factories/make-mensality";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";
import { ExistingResourceError } from "@core/errors/existing-resource-error";

let inMemoryMensalitiesRepository: InMemoryMensalitiesRepository;
let sut: UpdateMensalityUseCase;

describe("Update Mensality", () => {
  beforeEach(() => {
    inMemoryMensalitiesRepository = new InMemoryMensalitiesRepository();
    sut = new UpdateMensalityUseCase(inMemoryMensalitiesRepository);
  });

  it("should be able to update a mensality", async () => {
    const mensality = makeMensality();
    inMemoryMensalitiesRepository.create(mensality);

    await sut.execute({
      id: mensality.id.toString(),
      month: "JANUARY",
      year: 2025,
      priceInCents: 12000,
    });

    expect(inMemoryMensalitiesRepository.items[0]).toMatchObject({
      month: "JANUARY",
      year: 2025,
      priceInCents: 12000,
    });
  });

  it("should not be able to update a mensality that does not exist", async () => {
    await expect(
      sut.execute({
        id: "non-existing-id",
        month: "JANUARY",
        year: 2025,
        priceInCents: 12000,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a mensality to a month and year that already exists", async () => {
    const mensality1 = makeMensality({ month: "JANUARY", year: 2025 });
    const mensality2 = makeMensality({ month: "FEBRUARY", year: 2025 });
    inMemoryMensalitiesRepository.create(mensality1);
    inMemoryMensalitiesRepository.create(mensality2);

    await expect(
      sut.execute({
        id: mensality2.id.toString(),
        month: "JANUARY",
        year: 2025,
      })
    ).rejects.toBeInstanceOf(ExistingResourceError);
  });
});
