import { PinoLogger } from "@infra/logger/pino-logger";
import { asClass, createContainer } from "awilix";
import registerRepositories from "../container/repositories";
import registerUseCases from "../container/use-cases";

const container = createContainer();

container.register({
  logger: asClass(PinoLogger).singleton(),
});

registerRepositories(container);
registerUseCases(container);

export default container;
