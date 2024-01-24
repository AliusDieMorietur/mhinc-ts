import { Runner, RunnerMessage } from "../../types/runner";
import { Context } from "../../types/context";
import { Photo } from "../../types/telegram";
import EventEmitter from "node:events";
import { ActivityRouter } from "../activityRouter";
import { RunnerBase } from "./runnerBase";
import { TelegramChannel } from "../telegramChannel";
import { StateManager } from "../stateManager";
import { ADMIN_ID, CHANNEL_ID } from "../../consts";
import { FileStorage } from "../fileStorage";

export const MODERATION_TEXT =
  "/moderation - moderation bot\n /share - share photo";

export const NO_PERMISSION_TEXT = "no permission";

export type ModerationRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
  fileStorage: FileStorage;
};

export class ModerationRunner extends RunnerBase {
  public fileStorage: ModerationRunnerOptions["fileStorage"];

  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
    fileStorage,
  }: ModerationRunnerOptions) {
    console.log("Moderation_RUNNER_CONSTRUCTOR");
    console.log("telegramChannel", telegramChannel);
    super({
      name: Runner.MODERATION,
      activityRouter,
      telegramChannel,
      stateManager,
    });
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
          this.telegramChannel.sendMessage(chatId, "Your photo was approved");
          if (file) {
            console.log("chatId", chatId);
            this.telegramChannel.sendPhoto(CHANNEL_ID, file.fileId, {});
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
