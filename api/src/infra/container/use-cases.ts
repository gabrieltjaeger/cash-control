import { asFunction, AwilixContainer } from "awilix";

import { FetchAssociateUseCase } from "@core/use-cases/fetch-associate";
import { FetchAssociateMensalitiesUseCase } from "@core/use-cases/fetch-associate-mensalities";
import { ListAssociatesUseCase } from "@core/use-cases/list-associates";
import { ListMensalitiesUseCase } from "@core/use-cases/list-mensalities";
import { RegisterAssociateUseCase } from "@core/use-cases/register-associate";
import { RegisterMensalityUseCase } from "@core/use-cases/register-mensality";
import { RegisterPaymentUseCase } from "@core/use-cases/register-payment";

export default (container: AwilixContainer): void => {
  container.register({
    registerAssociateUseCase: asFunction(
      ({ associatesRepository }) =>
        new RegisterAssociateUseCase(associatesRepository)
    ),
    fetchAssociateUseCase: asFunction(
      ({ associatesRepository }) =>
        new FetchAssociateUseCase(associatesRepository)
    ),
    fetchAssociateMensalitiesUseCase: asFunction(
      ({ associatesRepository }) =>
        new FetchAssociateMensalitiesUseCase(associatesRepository)
    ),
    listAssociatesUseCase: asFunction(
      ({ associatesRepository }) =>
        new ListAssociatesUseCase(associatesRepository)
    ),
    registerMensalityUseCase: asFunction(
      ({ mensalitiesRepository }) =>
        new RegisterMensalityUseCase(mensalitiesRepository)
    ),
    listMensalitiesUseCase: asFunction(
      ({ mensalitiesRepository }) =>
        new ListMensalitiesUseCase(mensalitiesRepository)
    ),
    registerPaymentUseCase: asFunction(
      ({ paymentsRepository, mensalitiesRepository, associatesRepository }) =>
        new RegisterPaymentUseCase(
          paymentsRepository,
          mensalitiesRepository,
          associatesRepository
        )
    ),
  });
};
