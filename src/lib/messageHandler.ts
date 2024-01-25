import { Context } from "../types/context";
import { Runner, RunnerMessage } from "../types/runner";
import { Update } from "../types/telegram";
import { ActivityRouter } from "./activityRouter";
import { TelegramChannel } from "./telegramChannel";
import { UserService } from "./userService";

export type MessageHandlerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  storage: {
    user: UserService;
  };
};

export class MessageHandler {
  private activityRouter: MessageHandlerOptions["activityRouter"];
  private telegramChannel: MessageHandlerOptions["telegramChannel"];
  private storage: MessageHandlerOptions["storage"];

  constructor({
    activityRouter,
    storage,
    telegramChannel,
  }: MessageHandlerOptions) {
    this.activityRouter = activityRouter;
    this.storage = storage;
    this.telegramChannel = telegramChannel;
  }

  async handleMessage(update: Update) {
    console.log("MESSAGE_HANDLER handleMessage");
    console.log("update", update);
    let telegramMessage = update.message;

    if (!telegramMessage && update.callback_query) {
      telegramMessage = update.callback_query.message;
      this.telegramChannel.answerCallback(update.callback_query.id);
    }

    if (!telegramMessage) {
      console.warn("no message");
      return;
    }

    const telegramChatId = telegramMessage.chat.id;
    const name =
      telegramMessage.from.username || telegramMessage.from.first_name || "";
    const user = await this.storage.user.getByChatIdOrCreate(
      telegramChatId,
      name
    );
    console.log("user", user);

    const context = {
      userId: user.id,
      telegramChatId,
      name,
    };
    console.log("context", context);

    let values = [""];
    if (!!telegramMessage.text) {
      values = telegramMessage.text.split(" ");
    }
    if (!!update.callback_query) {
      values = update.callback_query.data.split(" ");
    }
    console.log("values", values);
    const command = values[0];
    if (command.startsWith("/")) {
      const args = values.slice(1);
      console.log("command", command);
      console.log("args", args);
      const runnerName = command.slice(1) as Runner;
      const variants = Object.values(Runner);
      const route = variants.includes(runnerName)
        ? runnerName
        : Runner.UNHANDLED;
      this.activityRouter.route(context, route, args);
    } else {
      const message: RunnerMessage = {
        text: telegramMessage.text || "",
        photo: telegramMessage.photo || [],
        video: telegramMessage.video,
        mediaGroupId: telegramMessage.media_group_id,
      };
      console.log("message", message);
      this.activityRouter.routeMessage(context, message);
    }
  }
}
