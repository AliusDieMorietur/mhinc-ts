import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { ActivityRouter } from "../activityRouter";
import { StateManager } from "../stateManager";
import { TelegramChannel } from "../telegramChannel";
import { RunnerBase } from "./runnerBase";

export type EchoRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
};

export class EchoRunner extends RunnerBase {
  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
  }: EchoRunnerOptions) {
    super({
      name: Runner.ECHO,
      activityRouter,
      telegramChannel,
      stateManager,
    });
    this.init({
      onMessage: (context: Context, message: RunnerMessage) => {
        this.telegramChannel.sendMessage(context.telegramChatId, message.text);
        this.stateManager.create(context.userId, {
          runner: Runner.ECHO,
          state: "none",
          data: {},
        });
      },
      onStart: (context: Context, args: string[]) => {
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          "echo: " + args.join(" ")
        );
        this.stateManager.create(context.userId, {
          runner: Runner.ECHO,
          state: "none",
          data: {},
        });
      },
    });
  }
}
