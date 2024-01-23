import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { StartRunner } from "../lib/runners/startRunner";
import { EchoRunner } from "../lib/runners/echoRunner";

declare module "fastify" {
  interface FastifyInstance {
    runner: {
      start: StartRunner;
      echo: EchoRunner;
    };
  }
}

const runnerPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("runner")) return;
  console.log("app.telegramChannel", app.telegramChannel);
  const defaultRunnerOptions = {
    activityRouter: app.activityRouter,
    telegramChannel: app.telegramChannel,
    stateManager: app.stateManager,
  };
  const runner = {
    start: new StartRunner(defaultRunnerOptions),
    echo: new EchoRunner(defaultRunnerOptions),
  };
  app.decorate("runner", runner);
};

export default fp(runnerPlugin, {
  name: "runnerPlugin",
  dependencies: [
    "ActivityRouterPlugin",
    "TelegramChannelPlugin",
    "StateManagerPlugin",
  ],
});
