import { Update } from "../types/telegram";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: Update;
    Reply: string;
  }>("/telegram/webhook", {}, async ({ body: update }) => {
    console.log("update", update);
    let message = update.message;
    if (!message && update.callback_query) {
      message = update.callback_query.message;
      app.telegramChannel.answerCallback(update.callback_query.id);
    }

    const telegramChatId = message.chat.id;
    const name = message.from.username || message.from.first_name || "";
    const user = await app.userService.getByChatIdOrCreate(
      telegramChatId,
      name
    );
    console.log("user", user);
    const context = {
      userId: user.id,
      telegramChatId,
      name,
    };
    app.messageHandler.handleMessage(context, update);
    return "ok";
  });
}
