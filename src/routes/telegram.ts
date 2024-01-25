import { Update } from "../types/telegram";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: Update;
    Reply: string;
  }>("/telegram/webhook", {}, async ({ body: update }) => {
    app.messageHandler.handleMessage(update);
    return "ok";
  });
}
