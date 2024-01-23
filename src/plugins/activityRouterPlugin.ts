import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ActivityRouter } from "../lib/activityRouter";

declare module "fastify" {
  interface FastifyInstance {
    activityRouter: ActivityRouter;
  }
}

const activityRouterPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("activityRouter")) return;
  const activityRouter = new ActivityRouter({ stateManager: app.stateManager });
  app.decorate("activityRouter", activityRouter);
};

export default fp(activityRouterPlugin, {
  name: "ActivityRouterPlugin",
  dependencies: ["StateManagerPlugin"],
});
