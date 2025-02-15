import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { ActivityRouter } from "../activityRouter";
import { StateManager } from "../stateManager";
import { TelegramChannel } from "../telegramChannel";
import { RunnerBase } from "./base";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export type EchoRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class EchoRunner extends RunnerBaseExtended {
  constructor(options: EchoRunnerOptions) {
    ("Echo_RUNNER_CONSTRUCTOR");
    super({
      name: Runner.ECHO,
      ...options,
    });
    this.init({
      onMessage: (context: Context, message: RunnerMessage) => {
        this.telegramChannel.sendMessage(context.telegramChatId, message.text);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.ECHO,
          state: "none",
          data: {},
        });
      },
      onStart: (context: Context, args: string) => {
        this.telegramChannel.sendMessage(context.telegramChatId, "echo: " + args);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.ECHO,
          state: "none",
          data: {},
        });
      },
    });
  }
}
