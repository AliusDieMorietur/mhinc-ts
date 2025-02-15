import { ADMIN_ID, CHANNEL_ID } from "../../consts";
import { Context } from "../../types/context";
import { FileType } from "../../types/file";
import { Language } from "../../types/i18next";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export const NO_PERMISSION_TEXT = "no permission";

export type ModerationRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class ModerationRunner extends RunnerBaseExtended {
  constructor(options: ModerationRunnerOptions) {
    super({
      name: Runner.MODERATION,
      ...options,
    });
    const typeToMethod = {
      [FileType.PHOTO]: this.telegramChannel.sendPhoto.bind(this.telegramChannel),
      [FileType.VIDEO]: this.telegramChannel.sendVideo.bind(this.telegramChannel),
      [FileType.ANIMATION]: this.telegramChannel.sendAnimation.bind(this.telegramChannel),
    };
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {},
      onStart: async (context: Context, args: string) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        if (context.telegramChatId !== ADMIN_ID) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            this.localizationService.resolve("label.NoPermission", user.language),
          );
          this.activityRouter.route(context, Runner.START, "");
          return;
        }
        const [command, id, chatId, caption] = (() => {
          const result = [];
          const SEPARATOR = " ";
          let startIndex = 0;
          let argsQuantity = 0;
          while (argsQuantity < 3) {
            const nextSeparatorIndex = args.indexOf(SEPARATOR, startIndex);
            result.push(args.slice(startIndex, nextSeparatorIndex));
            startIndex = nextSeparatorIndex + 1;
            argsQuantity++;
          }
          result.push(args.slice(startIndex));
          return result;
        })();
        const chatIdNumber = Number(chatId);
        const file = await this.storage.file.get(id);
        const author = await this.storage.user.getByChatId(chatIdNumber);
        if (command === "approve") {
          if (file) {
            const method = typeToMethod[file.type];
            method(
              CHANNEL_ID,
              file.fileId,
              undefined,
              caption !== ""
                ? caption
                : this.localizationService.resolve("label.Anonymous", Language.UA),
            );
            this.telegramChannel.sendMessage(
              chatIdNumber,
              this.localizationService.resolve("label.YourContentWasApproved", author.language),
            );
          }
        } else {
          this.telegramChannel.sendMessage(
            chatIdNumber,
            this.localizationService.resolve("label.YourContentWasRejected", author.language),
          );
        }
      },
    });
  }
}
