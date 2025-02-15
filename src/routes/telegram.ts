import { Language } from "../types/i18next";
import { Update } from "../types/telegram";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: Update;
    Reply: string;
  }>("/telegram/webhook", {}, async ({ body: update }) => {
    const telegramMessage = update.message || update.callback_query?.message;

    if (telegramMessage) {
      const telegramChatId = telegramMessage.chat.id;
      const name = telegramMessage.from.username || telegramMessage.from.first_name || "";
      await app.storage.user.getByChatIdOrCreate({
        name,
        language: Language.EN,
        telegramChatId,
      });
    }

    app.messageHandler.handleMessage(update);
    return "ok";
  });
}
