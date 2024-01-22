import { Update } from "@/types/telegram";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: Update;
    Reply: string;
  }>("/telegram/webhook", {}, async ({ body }) => {
    app.telegramChannel.sendMessage(body.message.text, body.message.chat.id);
    console.log("body", body);
    return JSON.stringify(body);
  });
}
