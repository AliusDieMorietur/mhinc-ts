import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { StartRunner } from "../lib/runner/start";
import { EchoRunner } from "../lib/runner/echo";
import { UnhandledRunner } from "../lib/runner/unhandled";
import { ShareRunner } from "../lib/runner/share";
import { ModerationRunner } from "../lib/runner/moderation";
import { HelpRunner } from "../lib/runner/help";
import { MenuRunner } from "../lib/runner/menu";

declare module "fastify" {
  interface FastifyInstance {
    runner: {
      start: StartRunner;
      echo: EchoRunner;
      unhandled: UnhandledRunner;
      share: ShareRunner;
      moderation: ModerationRunner;
      help: HelpRunner;
      menu: MenuRunner;
    };
  }
}

const runnerPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("runner")) return;
  const defaultRunnerOptions = {
    activityRouter: app.activityRouter,
    telegramChannel: app.telegramChannel,
    stateManager: app.stateManager,
    storage: app.storage,
    localizationService: app.localizationService,
  };
  const runner = {
    start: new StartRunner(defaultRunnerOptions),
    echo: new EchoRunner(defaultRunnerOptions),
    unhandled: new UnhandledRunner(defaultRunnerOptions),
    share: new ShareRunner(defaultRunnerOptions),
    moderation: new ModerationRunner(defaultRunnerOptions),
    help: new HelpRunner(defaultRunnerOptions),
    menu: new MenuRunner(defaultRunnerOptions),
  };
  app.decorate("runner", runner);
};

export default fp(runnerPlugin, {
  name: "runnerPlugin",
  dependencies: [
    "ActivityRouterPlugin",
    "TelegramChannelPlugin",
    "StateManagerPlugin",
    "StoragePlugin",
    "LocalizationServicePlugin",
  ],
});
