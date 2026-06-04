import { createContainer } from "awilix";
import registerRepositories from "./repositories";
import registerUseCases from "./use-cases";

const container = createContainer();

registerRepositories(container);
registerUseCases(container);

export default container;
