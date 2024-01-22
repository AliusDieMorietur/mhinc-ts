import { InitError } from "../types/error";
import { TelegramChannel } from "../lib/TelegramChannel";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import ngrok from "ngrok";

declare module "fastify" {
  interface FastifyInstance {
    telegramChannel: TelegramChannel;
  }
}

const userPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("telegramChannel")) return;
  let serverUrl = app.config.serverUrl;
  if (!serverUrl) {
    if (!app.config.ngrokToken) {
      throw new InitError("Ngrok token not found ");
    }
    serverUrl = await ngrok.connect({
      token: app.config.ngrokToken,
      addr: 3008,
    });
  }
  const telegramChannel = new TelegramChannel({
    serverUrl,
    apiUrl: app.config.telegramApiUrl,
    token: app.config.telegramToken,
    http: app.http,
  });
  telegramChannel.start();
  app.decorate("telegramChannel", telegramChannel);
};

export default fp(userPlugin, {
  name: "TelegramChannelPlugin",
  dependencies: ["ConfigPlugin", "HttpPlugin"],
});
