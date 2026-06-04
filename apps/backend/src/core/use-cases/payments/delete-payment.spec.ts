import { InMemoryPaymentsRepository } from "@test/repositories/in-memory-payments-repository";
import { DeletePaymentUseCase } from "./delete-payment";
import { makePayment } from "@test/factories/make-payment";
import { ResourceNotFoundError } from "@core/errors/resource-not-found-error";

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let sut: DeletePaymentUseCase;

describe("Delete Payment", () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    sut = new DeletePaymentUseCase(inMemoryPaymentsRepository);
  });

  it("should be able to delete a payment", async () => {
    const payment = makePayment();
    inMemoryPaymentsRepository.create(payment);

    await sut.execute({
      id: payment.id.toString(),
    });

    expect(inMemoryPaymentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a payment that does not exist", async () => {
    await expect(
      sut.execute({
        id: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
