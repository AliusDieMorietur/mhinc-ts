import { Context } from "../../types/context";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export type HelpRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class HelpRunner extends RunnerBaseExtended {
  constructor(options: HelpRunnerOptions) {
    super({
      name: Runner.HELP,
      ...options,
    });
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {},
      onStart: async (context: Context, _: string) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        const text = this.localizationService.resolve("label.Help", user.language);
        this.telegramChannel.sendMessage(context.telegramChatId, text);
      },
    });
  }
}
