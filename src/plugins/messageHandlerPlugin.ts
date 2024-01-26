import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { MessageHandler } from "../lib/messageHandler";

declare module "fastify" {
  interface FastifyInstance {
    messageHandler: MessageHandler;
  }
}

const messageHandlerPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("messageHandler")) return;
  const messageHandler = new MessageHandler({
    activityRouter: app.activityRouter,
    telegramChannel: app.telegramChannel,
  });
  app.decorate("messageHandler", messageHandler);
};

export default fp(messageHandlerPlugin, {
  name: "MessageHandlerPlugin",
  dependencies: ["ActivityRouterPlugin", "TelegramChannelPlugin"],
});
