import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export type HelpRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class HelpRunner extends RunnerBaseExtended {
  constructor(options: HelpRunnerOptions) {
    console.log("Help_RUNNER_CONSTRUCTOR");
    super({
      name: Runner.HELP,
      ...options,
    });
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const text = this.localizationService.resolve(
          "label.Help",
          user.language
        );
        this.telegramChannel.sendMessage(context.telegramChatId, text);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.HELP,
          state: "none",
          data: {},
        });
      },
      onStart: async (context: Context, args: string[]) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const text = this.localizationService.resolve(
          "label.Help",
          user.language
        );
        this.telegramChannel.sendMessage(context.telegramChatId, text);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.HELP,
          state: "none",
          data: {},
        });
      },
    });
  }
}
