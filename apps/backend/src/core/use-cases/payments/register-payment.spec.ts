import { InMemoryPaymentsRepository } from "@test/repositories/in-memory-payments-repository";
import { RegisterPaymentUseCase } from "./register-payment";
import { InMemoryMensalitiesRepository } from "@test/repositories/in-memory-mensalities-repository";
import { InMemoryAssociatesRepository } from "@test/repositories/in-memory-associates-repository";
import { makeAssociate } from "@test/factories/make-associate";
import { makeMensality } from "@test/factories/make-mensality";
import { DomainError } from "@core/errors/domain-error";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryMensalitiesRepository: InMemoryMensalitiesRepository;
let inMemoryAssociatesRepository: InMemoryAssociatesRepository;
let sut: RegisterPaymentUseCase;

describe("Register Payment", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryMensalitiesRepository = new InMemoryMensalitiesRepository();
    inMemoryAssociatesRepository = new InMemoryAssociatesRepository();
    sut = new RegisterPaymentUseCase(
      inMemoryPaymentsRepository,
      inMemoryMensalitiesRepository,
      inMemoryAssociatesRepository
    );
  });

  it("should be able to register a new payment", async () => {
    const associate = makeAssociate();
    const mensality = makeMensality();

    inMemoryAssociatesRepository.create(associate);
    inMemoryMensalitiesRepository.create(mensality);

    await sut.execute({
      associateId: associate.id.toString(),
      date: new Date(),
      mensalities: [
        {
          month: mensality.month,
          year: mensality.year,
        },
      ],
    });

    expect(inMemoryPaymentsRepository.items).toHaveLength(1);
  });

  it("should not be able to register a new payment with no mensalities", async () => {
    const associate = makeAssociate();
    inMemoryAssociatesRepository.create(associate);

    await expect(
      sut.execute({
        associateId: associate.id.toString(),
        date: new Date(),
        mensalities: [],
      })
    ).rejects.toBeInstanceOf(DomainError);
  });

  it("should not be able to register a new payment with a non-existing associate", async () => {
    const mensality = makeMensality();
    inMemoryMensalitiesRepository.create(mensality);

    await expect(
      sut.execute({
        associateId: "non-existing-id",
        date: new Date(),
        mensalities: [
          {
            month: mensality.month,
            year: mensality.year,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a new payment with a non-existing mensality", async () => {
    const associate = makeAssociate();
    inMemoryAssociatesRepository.create(associate);

    await expect(
      sut.execute({
        associateId: associate.id.toString(),
        date: new Date(),
        mensalities: [
          {
            month: "JANUARY",
            year: 2025,
          },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
