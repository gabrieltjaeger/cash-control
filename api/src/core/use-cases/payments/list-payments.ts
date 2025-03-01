import { PaymentsRepository } from "@core/repositories/payments-repository";

import { addMilliseconds } from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";
interface ListPaymentsUseCaseRequest {
  initialDate: Date;
  finalDate: Date | null;
  timeZone: string;
  selectBy: "day" | "month" | "year" | "range";
  page?: number;
  take?: number;
}

export class ListPaymentsUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  static getRange({
    initialDate,
    finalDate,
    timeZone,
    selectBy,
  }: Omit<ListPaymentsUseCaseRequest, "page" | "take">) {
    const offset = getTimezoneOffset(timeZone);

    if (selectBy !== "range") initialDate.setHours(0, 0, 0, 0);

    addMilliseconds(initialDate, offset);

    const since = new Date(initialDate);

    const ranges: Record<
      "day" | "month" | "year" | "range",
      {
        since: Date;
        until: Date;
      }
    > = {
      day: {
        since: new Date(since),
        until: new Date(since.getTime() + 86400000),
      },
      month: {
        since: new Date(since.getFullYear(), since.getMonth(), 1),
        until: new Date(since.getFullYear(), since.getMonth() + 1, 0),
      },
      year: {
        since: new Date(since.getFullYear(), 0, 1),
        until: new Date(since.getFullYear(), 11, 31),
      },
      range: {
        since: new Date(initialDate),
        until: finalDate ? new Date(finalDate) : new Date(initialDate),
      },
    };

    return ranges[selectBy];
  }

  async execute({
    initialDate,
    finalDate,
    timeZone,
    selectBy,
    page,
    take,
  }: ListPaymentsUseCaseRequest) {
    const { since, until } = ListPaymentsUseCase.getRange({
      initialDate,
      finalDate,
      timeZone,
      selectBy,
    });

    const payments = await this.paymentsRepository.list(
      "expanded",
      {
        since,
        until,
      },
      page,
      take
    );

    return { payments };
  }
}
