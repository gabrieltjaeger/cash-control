import { asFunction, AwilixContainer } from "awilix";

import { FetchAssociateUseCase } from "@core/use-cases/associates/fetch-associate";
import { FetchAssociateMensalitiesUseCase } from "@core/use-cases/associates/fetch-associate-mensalities";
import { ListAssociatesUseCase } from "@core/use-cases/associates/list-associates";
import { RegisterAssociateUseCase } from "@core/use-cases/associates/register-associate";
import { ListMensalitiesUseCase } from "@core/use-cases/mensalities/list-mensalities";
import { RegisterMensalityUseCase } from "@core/use-cases/mensalities/register-mensality";
import { RegisterPaymentUseCase } from "@core/use-cases/payments/register-payment";

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
