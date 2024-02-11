import { TelegramChannel } from "../lib/telegramChannel";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
const tunnelmole = require("tunnelmole/cjs");

declare module "fastify" {
  interface FastifyInstance {
    telegramChannel: TelegramChannel;
  }
}

const userPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("telegramChannel")) return;
  let serverUrl = app.config.serverUrl;
  if (!serverUrl) {
    serverUrl = await tunnelmole({
      port: 3008,
    });
    console.log("serverUrl", serverUrl);
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
