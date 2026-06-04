import { Payment, PaymentProps } from "@core/entities/payment";
import { CUID } from "@core/entities/types/CUID";

export function makePayment(
  override: Partial<PaymentProps> = {},
  id?: CUID
) {
  const payment = Payment.create({
    associateId: new CUID(),
    date: new Date(),
    valueInCents: 10000n,
    ...override,
    id,
  });

  return payment;
}
