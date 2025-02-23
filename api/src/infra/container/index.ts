import { createContainer } from "awilix";
import registerRepositories from "../container/repositories";
import registerUseCases from "../container/use-cases";

const container = createContainer();

registerRepositories(container);
registerUseCases(container);

export default container;
