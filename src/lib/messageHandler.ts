import { Context } from "../types/context";
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
    console.log("context", context);
    let telegramMessage = update.message;
    if (!telegramMessage && !!update.callbackQuery) {
      telegramMessage = update.callbackQuery.message;
    }
    const values = telegramMessage.text.split(" ");
    const command = values[0];
    if (command.startsWith("/")) {
      const args = values.slice(1);
      console.log("command", command);
      console.log("args", args);
      this.activityRouter.routeCommand(context, command.slice(1), args);
    } else {
      const message = {
        text: telegramMessage.text,
        photo: telegramMessage.photo,
      };
      console.log("message", message);
      this.activityRouter.routeMessage(context, message);
    }
  }
}
