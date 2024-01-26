import { ADMIN_ID, CHANNEL_ID } from "../../consts";
import { Context } from "../../types/context";
import { FileType } from "../../types/file";
import { Runner, RunnerMessage } from "../../types/runner";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export const MODERATION_TEXT =
  "/moderation - moderation bot\n /moderation - moderation photo";

export const NO_PERMISSION_TEXT = "no permission";

export type ModerationRunnerOptions = {} & Omit<
  RunnerBaseExtendedOptions,
  "name"
>;

export class ModerationRunner extends RunnerBaseExtended {
  constructor(options: ModerationRunnerOptions) {
    console.log("Moderation_RUNNER_CONSTRUCTOR");
    super({
      name: Runner.MODERATION,
      ...options,
    });
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {},
      onStart: async (context: Context, args: string[]) => {
        if (context.telegramChatId !== ADMIN_ID) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            NO_PERMISSION_TEXT
          );
          this.activityRouter.route(context, Runner.START, []);
          return;
        }
        console.log("args", args);
        const [command, id, chatId, caption] = args;
        const chatIdNumber = Number(chatId);
        const file = await this.storage.file.get(id);
        const user = await this.storage.user.getByChatId(chatIdNumber);
        if (command === "approve") {
          if (file) {
            if (file.type === FileType.PHOTO) {
              this.telegramChannel.sendPhoto(
                CHANNEL_ID,
                file.fileId,
                {},
                caption
              );
            } else {
              this.telegramChannel.sendVideo(
                CHANNEL_ID,
                file.fileId,
                {},
                caption
              );
            }
            this.telegramChannel.sendMessage(
              chatIdNumber,
              this.localizationService.resolve(
                "label.YourContentWasApproved",
                user.language
              )
            );
          }
        } else {
          this.telegramChannel.sendMessage(
            chatIdNumber,
            this.localizationService.resolve(
              "label.YourContentWasRejected",
              user.language
            )
          );
        }
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.MODERATION,
          state: "none",
          data: {},
        });
      },
    });
  }
}
