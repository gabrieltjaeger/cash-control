import { asClass, AwilixContainer } from "awilix";

import { PrismaAddressesRepository } from "../database/repositories/prisma-addresses-repository";
import { PrismaAssociatesRepository } from "../database/repositories/prisma-associates-repository";
import { PrismaMensalitiesRepository } from "../database/repositories/prisma-mensalities-repository";
import { PrismaPaymentsRepository } from "../database/repositories/prisma-payments-repository";
import { PrismaSessionsRepository } from "../database/repositories/prisma-sessions-repository";
import { PrismaSystemConfigsRepository } from "../database/repositories/prisma-system-configs-repository";
import { PrismaUsersRepository } from "../database/repositories/prisma-users-repository";

export default (container: AwilixContainer): void => {
  container.register({
    addressesRepository: asClass(PrismaAddressesRepository).singleton(),
    associatesRepository: asClass(PrismaAssociatesRepository).singleton(),
    mensalitiesRepository: asClass(PrismaMensalitiesRepository).singleton(),
    paymentsRepository: asClass(PrismaPaymentsRepository).singleton(),
    sessionsRepository: asClass(PrismaSessionsRepository).singleton(),
    systemConfigsRepository: asClass(PrismaSystemConfigsRepository).singleton(),
    usersRepository: asClass(PrismaUsersRepository).singleton(),
  });
};
