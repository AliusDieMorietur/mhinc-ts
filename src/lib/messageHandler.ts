import { Context } from "../types/context";
import { Runner, RunnerMessage } from "../types/runner";
import { Update } from "../types/telegram";
import { ActivityRouter } from "./activityRouter";

export type MessageHandlerOptions = {
  activityRouter: ActivityRouter;
};

export class MessageHandler {
  private activityRouter: MessageHandlerOptions["activityRouter"];

  constructor({ activityRouter }: MessageHandlerOptions) {
    this.activityRouter = activityRouter;
  }

  handleMessage(context: Context, update: Update) {
    console.log("MESSAGE_HANDLER handleMessage");
    console.log("update", update);
    console.log("context", context);
    let telegramMessage = update.message;
    console.log("telegramMessage", telegramMessage);
    if (!telegramMessage && !!update.callback_query) {
      telegramMessage = update.callback_query.message;
    }
    let values = [""];
    if (telegramMessage.text) {
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
        mediaGroupId: telegramMessage.media_group_id,
      };
      console.log("message", message);
      this.activityRouter.routeMessage(context, message);
    }
  }
}
