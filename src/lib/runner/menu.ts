import { ADMIN_ID, CHANNEL_ID } from "../../consts";
import { Context } from "../../types/context";
import { FileType } from "../../types/file";
import { Language } from "../../types/i18next";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export const NO_PERMISSION_TEXT = "no permission";

export type MenuRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class MenuRunner extends RunnerBaseExtended {
  constructor(options: MenuRunnerOptions) {
    super({
      name: Runner.MENU,
      ...options,
    });
    const typeToMethod = {
      [FileType.PHOTO]: this.telegramChannel.sendPhoto.bind(this.telegramChannel),
      [FileType.VIDEO]: this.telegramChannel.sendVideo.bind(this.telegramChannel),
      [FileType.ANIMATION]: this.telegramChannel.sendAnimation.bind(this.telegramChannel),
    };
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        const text = this.localizationService.resolve("label.Start", user.language);
        const startText = this.localizationService.resolve("button.Start", user.language);
        const shareText = this.localizationService.resolve("button.Share", user.language);
        const helpText = this.localizationService.resolve("button.Help", user.language);
        const textToRunner: Record<string, Runner> = {
          [startText]: Runner.START,
          [shareText]: Runner.SHARE,
          [helpText]: Runner.HELP,
        };
        const runner = textToRunner[message.text];
        if (runner) {
          this.activityRouter.route(context, runner, "");
          return;
        }
        this.telegramChannel.sendMessage(context.telegramChatId, text, {
          keyboard: [[{ text: startText }], [{ text: shareText }], [{ text: helpText }]],
        });
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.MENU,
          state: "none",
          data: {},
        });
      },
      onStart: async (context: Context, _: string) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        const text = this.localizationService.resolve("label.Start", user.language);
        const startText = this.localizationService.resolve("button.Start", user.language);
        const shareText = this.localizationService.resolve("button.Share", user.language);
        const helpText = this.localizationService.resolve("button.Help", user.language);
        this.telegramChannel.sendMessage(context.telegramChatId, text, {
          keyboard: [[{ text: startText }], [{ text: shareText }], [{ text: helpText }]],
        });
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.MENU,
          state: "none",
          data: {},
        });
      },
    });
  }
}
