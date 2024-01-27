import { Runner, RunnerMessage } from "../types/runner";
import { Update } from "../types/telegram";
import { ActivityRouter } from "./activityRouter";
import { TelegramChannel } from "./telegramChannel";

export type MessageHandlerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
};

export class MessageHandler {
  private activityRouter: MessageHandlerOptions["activityRouter"];
  private telegramChannel: MessageHandlerOptions["telegramChannel"];

  constructor({ activityRouter, telegramChannel }: MessageHandlerOptions) {
    this.activityRouter = activityRouter;
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

    const context = {
      telegramChatId,
    };
    console.log("context", context);

    const text = update.callback_query?.data || telegramMessage.text || "";

    const values = text.split(" ");
    console.log("values", values);
    const command = values[0] || "";
    if (command.startsWith("/")) {
      const args = values.slice(1);
      console.log("command", command);
      console.log("args", args);
      const runnerName = command.slice(1) as Runner;
      const variants = Object.values(Runner);
      const route = variants.includes(runnerName) ? runnerName : Runner.UNHANDLED;
      this.activityRouter.route(context, route, args);
    } else {
      const message: RunnerMessage = {
        text,
        photo: telegramMessage.photo || [],
        video: telegramMessage.video,
        mediaGroupId: telegramMessage.media_group_id,
        animation: telegramMessage.animation,
      };
      console.log("message", message);
      this.activityRouter.routeMessage(context, message);
    }
  }
}
