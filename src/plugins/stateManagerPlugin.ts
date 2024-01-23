import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UserService } from "../lib/userService";
import { StateManager } from "../lib/stateManager";

declare module "fastify" {
  interface FastifyInstance {
    stateManager: StateManager;
  }
}

const stateManagerPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("stateManager")) return;
  const stateManager = new StateManager();
  app.decorate("stateManager", stateManager);
};

export default fp(stateManagerPlugin, {
  name: "StateManagerPlugin",
  dependencies: [],
});
