import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export type UnhandledRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class UnhandledRunner extends RunnerBaseExtended {
  constructor(options: UnhandledRunnerOptions) {
    super({
      name: Runner.UNHANDLED,
      ...options,
    });
    this.init({
      onMessage: (context: Context, message: RunnerMessage) => {
        this.telegramChannel.sendMessage(context.telegramChatId, "return to main /start");
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.UNHANDLED,
          state: "none",
          data: {},
        });
      },
      onStart: (context: Context, _: string) => {
        this.telegramChannel.sendMessage(context.telegramChatId, "Unhandled");
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.UNHANDLED,
          state: "none",
          data: {},
        });
        this.activityRouter.route(context, Runner.START, "");
      },
    });
  }
}
