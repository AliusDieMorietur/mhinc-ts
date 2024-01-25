import { Runner, RunnerMessage } from "../../types/runner";
import { Context } from "../../types/context";
import { Photo } from "../../types/telegram";
import EventEmitter from "node:events";
import { ActivityRouter } from "../activityRouter";
import { RunnerBase } from "./runnerBase";
import { TelegramChannel } from "../telegramChannel";
import { StateManager } from "../stateManager";
import { ADMIN_ID } from "../../consts";
import { FileStorage, FileType } from "../fileStorage";

export type ShareRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
  fileStorage: FileStorage;
};

export class ShareRunner extends RunnerBase {
  public fileStorage: ShareRunnerOptions["fileStorage"];

  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
    fileStorage,
  }: ShareRunnerOptions) {
    console.log("Share_RUNNER_CONSTRUCTOR");
    console.log("telegramChannel", telegramChannel);
    super({
      name: Runner.SHARE,
      activityRouter,
      telegramChannel,
      stateManager,
    });
    this.fileStorage = fileStorage;
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {
        const state = await this.stateManager.get(context.userId);
        if (message.video) {
          const fileId = message.video.file_id;
          const id = await this.fileStorage.upload(fileId, FileType.VIDEO);
          const replyMarkup = {
            inline_keyboard: [
              [
                {
                  text: "Approve",
                  callback_data: `/moderation approve ${id} ${context.telegramChatId}`,
                },
                {
                  text: "Reject",
                  callback_data: `/moderation reject ${id} ${context.telegramChatId}`,
                },
              ],
            ],
          };
          console.log("context.username", context.username);
          this.telegramChannel.sendVideo(
            ADMIN_ID,
            fileId,
            replyMarkup,
            "By: @" + context.name
          );
        }
        if (message.photo.length > 0) {
          const fileId = message.photo.at(-1)!.file_id;
          const id = await this.fileStorage.upload(fileId, FileType.PHOTO);
          const replyMarkup = {
            inline_keyboard: [
              [
                {
                  text: "Approve",
                  callback_data: `/moderation approve ${id} ${context.telegramChatId}`,
                },
                {
                  text: "Reject",
                  callback_data: `/moderation reject ${id} ${context.telegramChatId}`,
                },
              ],
            ],
          };
          console.log("context.username", context.username);
          this.telegramChannel.sendPhoto(
            ADMIN_ID,
            fileId,
            replyMarkup,
            "By: @" + context.name
          );
        }
        if (message.mediaGroupId !== state.data.mediaGroupId) {
          this.telegramChannel.sendMessage(context.telegramChatId, "sent");
        }
        this.stateManager.create(context.userId, {
          runner: Runner.SHARE,
          state: "share",
          data: {
            mediaGroupId: message.mediaGroupId,
          },
        });
      },
      onStart: (context: Context, args: string[]) => {
        this.telegramChannel.sendMessage(context.telegramChatId, "Share pls");
        this.stateManager.create(context.userId, {
          runner: Runner.SHARE,
          state: "share",
          data: {},
        });
      },
    });
  }
}
