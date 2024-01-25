import { Runner, RunnerMessage } from "../../types/runner";
import { Context } from "../../types/context";
import { Photo } from "../../types/telegram";
import EventEmitter from "node:events";
import { ActivityRouter } from "../activityRouter";
import { RunnerBase } from "./runnerBase";
import { TelegramChannel } from "../telegramChannel";
import { StateManager } from "../stateManager";
import { ADMIN_ID, CHANNEL_ID } from "../../consts";
import { FileStorage, FileType } from "../fileStorage";
import { UserService } from "../userService";

export const MODERATION_TEXT =
  "/moderation - moderation bot\n /share - share photo";

export const NO_PERMISSION_TEXT = "no permission";

export type ModerationRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
  fileStorage: FileStorage;
  storage: {
    user: UserService;
  };
};

export class ModerationRunner extends RunnerBase {
  public fileStorage: ModerationRunnerOptions["fileStorage"];
  public storage: ModerationRunnerOptions["storage"];

  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
    fileStorage,
    storage,
  }: ModerationRunnerOptions) {
    console.log("Moderation_RUNNER_CONSTRUCTOR");
    console.log("telegramChannel", telegramChannel);
    super({
      name: Runner.MODERATION,
      activityRouter,
      telegramChannel,
      stateManager,
    });
    this.storage = storage;
    this.fileStorage = fileStorage;
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
        const [command, id, chatId] = args;
        const file = await this.fileStorage.get(id);
        console.log("file", file);
        console.log("CHANNEL_ID", CHANNEL_ID);
        if (command === "approve") {
          if (file) {
            console.log("chatId", chatId);
            const user = await this.storage.user.getByChatId(Number(chatId));
            const caption = `By: @${user.name}`;
            if (file.type === FileType.PHOTO) {
              this.telegramChannel.sendPhoto(
                CHANNEL_ID,
                file.fileId,
                {},
                caption
              );
              this.telegramChannel.sendMessage(
                chatId,
                "Your photo was approved"
              );
            } else {
              this.telegramChannel.sendVideo(
                CHANNEL_ID,
                file.fileId,
                {},
                caption
              );
              this.telegramChannel.sendMessage(
                chatId,
                "Your video was approved"
              );
            }
          } else {
            this.telegramChannel.sendMessage(
              context.userId,
              `File not found: "${file}"`
            );
          }
        } else {
          this.telegramChannel.sendMessage(chatId, "Your photo was rejected");
        }
        this.stateManager.create(context.userId, {
          runner: Runner.MODERATION,
          state: "none",
          data: {},
        });
      },
    });
  }
}
