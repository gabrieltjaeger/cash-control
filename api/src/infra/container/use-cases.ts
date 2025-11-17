import { asFunction, AwilixContainer } from "awilix";

import { FetchAssociateUseCase } from "@core/use-cases/associates/fetch-associate";
import { FetchAssociateMensalitiesUseCase } from "@core/use-cases/associates/fetch-associate-mensalities";
import { ListAssociatesUseCase } from "@core/use-cases/associates/list-associates";
import { RegisterAssociateUseCase } from "@core/use-cases/associates/register-associate";
import { UpdateAssociateUseCase } from "@core/use-cases/associates/update-associate";

import { ListMensalitiesUseCase } from "@core/use-cases/mensalities/list-mensalities";
import { RegisterMensalityUseCase } from "@core/use-cases/mensalities/register-mensality";
import { UpdateMensalityUseCase } from "@core/use-cases/mensalities/update-mensality";

import { DeletePaymentUseCase } from "@core/use-cases/payments/delete-payment";
import { ListPaymentsUseCase } from "@core/use-cases/payments/list-payments";
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
    updateAssociateUseCase: asFunction(
      ({ associatesRepository }) =>
        new UpdateAssociateUseCase(associatesRepository)
    ),
    registerMensalityUseCase: asFunction(
      ({ mensalitiesRepository }) =>
        new RegisterMensalityUseCase(mensalitiesRepository)
    ),
    listMensalitiesUseCase: asFunction(
      ({ mensalitiesRepository }) =>
        new ListMensalitiesUseCase(mensalitiesRepository)
    ),
    updateMensalityUseCase: asFunction(
      ({ mensalitiesRepository }) =>
        new UpdateMensalityUseCase(mensalitiesRepository)
    ),
    registerPaymentUseCase: asFunction(
      ({ paymentsRepository, mensalitiesRepository, associatesRepository }) =>
        new RegisterPaymentUseCase(
          paymentsRepository,
          mensalitiesRepository,
          associatesRepository
        )
    ),
    listPaymentsUseCase: asFunction(
      ({ paymentsRepository }) => new ListPaymentsUseCase(paymentsRepository)
    ),
    deletePaymentUseCase: asFunction(
      ({ paymentsRepository }) => new DeletePaymentUseCase(paymentsRepository)
    ),
  });
};
