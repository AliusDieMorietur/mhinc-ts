import { Update } from "../types/telegram";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: Update;
    Reply: string;
  }>("/telegram/webhook", {}, async ({ body: update }) => {
    console.log("update", update);
    let message = update.message;
    if (!message && update.callbackQuery) {
      message = update.callbackQuery.message;
    }

    const telegramChatId = message.chat.id;
    const user = await app.userService.getByChatIdOrCreate(telegramChatId);
    console.log("user", user);
    const context = {
      userId: user.id,
      telegramChatId,
    };
    app.messageHandler.handleMessage(context, update);
    return "ok";
  });
}
