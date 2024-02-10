import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import * as path from "path";
import dotenv from "dotenv";

import { ServiceEnv } from "../lib/env.js";
import { readFile } from "fs/promises";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      env: string;
      telegramToken: string;
      telegramApiUrl: string;
      serverUrl: string;
      ngrokToken: string;
    };
  }
}

const configPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("config")) return;

  const config = await readFile(path.resolve(process.cwd(), `.env.${ServiceEnv.LOCAL}`));
  const rawConfig = dotenv.parse(Buffer.from(config));

  const appConfig = {
    env: rawConfig.ENV,
    telegramToken: rawConfig.TELEGRAM_TOKEN,
    telegramApiUrl: rawConfig.TELEGRAM_API_URL,
    serverUrl: rawConfig.SERVER_URL,
    ngrokToken: rawConfig.NGROK_TOKEN,
  };

  app.decorate("config", appConfig);
};

export default fp(configPlugin, {
  name: "ConfigPlugin",
  dependencies: [],
});
