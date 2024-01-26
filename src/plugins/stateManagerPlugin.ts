import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { StateManager } from "../lib/stateManager";

declare module "fastify" {
  interface FastifyInstance {
    stateManager: StateManager;
  }
}

const StateManagerPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("stateManager")) return;
  const stateManager = new StateManager();
  app.decorate("stateManager", stateManager);
};

export default fp(StateManagerPlugin, {
  name: "StateManagerPlugin",
  dependencies: [],
});
