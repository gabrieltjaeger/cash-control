import { asClass, AwilixContainer } from "awilix";

import { PrismaAssociatesRepository } from "../database/repositories/prisma-associates-repository";
import { PrismaMensalitiesRepository } from "../database/repositories/prisma-mensalities-repository";
import { PrismaPaymentsRepository } from "../database/repositories/prisma-payments-repository";

export default (container: AwilixContainer): void => {
  container.register({
    associatesRepository: asClass(PrismaAssociatesRepository).singleton(),
    mensalitiesRepository: asClass(PrismaMensalitiesRepository).singleton(),
    paymentsRepository: asClass(PrismaPaymentsRepository).singleton(),
  });
};
