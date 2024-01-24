import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { ActivityRouter } from "../activityRouter";
import { StateManager } from "../stateManager";
import { TelegramChannel } from "../telegramChannel";
import { RunnerBase } from "./runnerBase";

export type UnhandledRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
};

export class UnhandledRunner extends RunnerBase {
  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
  }: UnhandledRunnerOptions) {
    super({
      name: Runner.UNHANDLED,
      activityRouter,
      telegramChannel,
      stateManager,
    });
    this.init({
      onMessage: (context: Context, message: RunnerMessage) => {
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          "return to main /start"
        );
        this.stateManager.create(context.userId, {
          runner: Runner.UNHANDLED,
          state: "none",
          data: {},
        });
      },
      onStart: (context: Context, args: string[]) => {
        this.telegramChannel.sendMessage(context.telegramChatId, "Unhandled");
        this.stateManager.create(context.userId, {
          runner: Runner.UNHANDLED,
          state: "none",
          data: {},
        });
        this.activityRouter.route(context, Runner.START, []);
      },
    });
  }
}
