<<<<<<< HEAD:apps/backend/src/infra/container/index.ts
import { createContainer } from "awilix";
import registerRepositories from "./repositories";
import registerUseCases from "./use-cases";
=======
import { PinoLogger } from "@infra/logger/pino-logger";
import { asClass, createContainer } from "awilix";
import registerRepositories from "../container/repositories";
import registerUseCases from "../container/use-cases";
>>>>>>> 10554b74d3298889f0d906a6ed856923a341b0d5:api/src/infra/container/index.ts

const container = createContainer();

container.register({
  logger: asClass(PinoLogger).singleton(),
});

registerRepositories(container);
registerUseCases(container);

export default container;
