import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { StartRunner } from "../lib/runners/startRunner";
import { EchoRunner } from "../lib/runners/echoRunner";
import { UnhandledRunner } from "../lib/runners/unhandledRunner";
import { ShareRunner } from "../lib/runners/shareRunner";
import { ModerationRunner } from "../lib/runners/moderationRunner";

declare module "fastify" {
  interface FastifyInstance {
    runner: {
      start: StartRunner;
      echo: EchoRunner;
      unhandled: UnhandledRunner;
      share: ShareRunner;
      moderation: ModerationRunner;
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
    fileStorage: app.fileStorage,
  };
  const runner = {
    start: new StartRunner(defaultRunnerOptions),
    echo: new EchoRunner(defaultRunnerOptions),
    unhandled: new UnhandledRunner(defaultRunnerOptions),
    share: new ShareRunner(defaultRunnerOptions),
    moderation: new ModerationRunner({
      ...defaultRunnerOptions,
      storage: {
        user: app.userService,
      },
    }),
  };
  app.decorate("runner", runner);
};

export default fp(runnerPlugin, {
  name: "runnerPlugin",
  dependencies: [
    "ActivityRouterPlugin",
    "TelegramChannelPlugin",
    "StateManagerPlugin",
    "FileStoragePlugin",
    "UserServicePlugin",
  ],
});
